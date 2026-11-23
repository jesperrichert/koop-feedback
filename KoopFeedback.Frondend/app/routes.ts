import {index, route, type RouteConfig} from "@react-router/dev/routes";

export default [
    index("routes/page.tsx"),
    route("state/start", "routes/state/start/page.tsx"),
    route("state/run", "routes/state/run/page.tsx"),
    route("state/end", "routes/state/end/page.tsx"),
] satisfies RouteConfig;
