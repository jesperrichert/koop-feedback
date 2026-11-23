package session

import (
	"context"
	"net/http"
	"strconv"

	"koopfeedback.de/internal/models"
	"koopfeedback.de/internal/types/feedback"
	"koopfeedback.de/internal/util"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type APIFeedback struct {
	UserId      int
	Type        feedback.FeedbackType
	Description string
}

type POSTFeedback struct {
	Feedback []APIFeedback
}

type POSTResponseFeedback struct {
	Success int
	Failed  int
}

func (c *Controller) PostSessionFeedback(ctx *gin.Context) {
	bCtx := context.Background()
	body, hasBody := util.APIBindBody[POSTFeedback](ctx)
	authId, _ := ctx.Get("authId")
	userId, _ := ctx.Get("userId")

	authUser, err := gorm.G[models.User](c.DB).Preload("Session", nil).Where("id = ?", userId).First(bCtx)

	if !hasBody {
		util.APIErrorResponse[POSTFeedback](ctx, "INVALID_BODY", http.StatusConflict)
		return
	}

	if !authUser.Session.IsStarted {
		util.APIErrorResponse[POSTFeedback](ctx, "NotActive", http.StatusLocked)
		return
	}
	if authUser.Session.IsFinished {
		util.APIErrorResponse[POSTFeedback](ctx, "NotActive", http.StatusLocked)
		return
	}

	if authUser.HasSubmitted {
		util.APIErrorResponse[POSTFeedback](ctx, "HasSubmitted", http.StatusConflict)
		return
	}

	if len(body.Feedback) == 0 {
		util.APIErrorResponse[POSTFeedback](ctx, "No Feedback found", http.StatusNotFound)
		return
	}

	successFeedback := 0
	for i := range body.Feedback {
		f := body.Feedback[i]

		isSameSession := util.DBCheckSameSession(c.DB, strconv.Itoa(userId.(int)), f.UserId)
		isSelf := util.DBCheckSelf(c.DB, authId.(string), f.UserId)
		if isSelf ||
			!isSameSession {
			continue
		}
		if f.Type == feedback.Unknown {
			continue
		}
		if len(f.Description) <= 10 {
			continue
		}

		err = gorm.G[models.FeedbackModel](c.DB).Create(bCtx, &models.FeedbackModel{
			Type:        f.Type,
			Description: f.Description,
			UserID:      f.UserId,
		})

		if err != nil {
			util.APIErrorResponse[POSTFeedback](ctx, err.Error(), http.StatusBadRequest)
			continue
		}
		successFeedback++
	}

	if successFeedback != 0 {
		_, err := gorm.G[models.User](c.DB).Where("id = ?", userId).Update(bCtx, "has_submitted", true)
		if err != nil {
			util.APIErrorResponse[POSTFeedback](ctx, err.Error(), http.StatusBadRequest)
			return
		}
		ctx.JSON(200, util.DefaultAPIResponse[POSTResponseFeedback]{
			Success: true,
			Message: "FEEDBACK",
			Data: POSTResponseFeedback{
				Success: successFeedback,
				Failed:  len(body.Feedback) - successFeedback,
			},
		})
		return
	}

	util.APIErrorResponse[POSTFeedback](ctx, "No Feedback submitted. try again", http.StatusBadRequest)
}
