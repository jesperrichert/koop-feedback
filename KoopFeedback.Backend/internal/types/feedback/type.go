package feedback

type FeedbackType int

const (
	Normal   FeedbackType = iota
	Positive FeedbackType = iota
	Unknown  FeedbackType = iota
)

var names = map[FeedbackType]string{
	Normal:   "normal",
	Positive: "positive",
	Unknown:  "unknown",
}

func ToType(str string) FeedbackType {
	for k, v := range names {
		if v == str {
			return k
		}
	}
	return Unknown
}

func (ft FeedbackType) Name() string {
	return names[ft]
}
