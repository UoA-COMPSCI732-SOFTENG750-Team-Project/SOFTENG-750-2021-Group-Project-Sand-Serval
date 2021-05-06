import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <Link to={"/sign-in"}>
            <Typography>
                Choose Date
            </Typography>
        </Link>
    )
}