import axios from "axios";

export let getCurrentUser = async () => {
    try {
        let res = await axios.get("/api/me")
        return res.data
    }
    catch (error) {
        return null
    }
}