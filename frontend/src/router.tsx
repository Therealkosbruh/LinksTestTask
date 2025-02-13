import { createBrowserRouter } from "react-router";
import Main from "./views/Main";
import Error from "./views/Error";

export const router = createBrowserRouter([
    {
        path:"/",
        element: <Main />
    },
    
    {
        path: "/error",
        element: <Error />
    },

    {
        path: "*",
        element: <Error />
    }
]);