import { useParams } from "react-router-dom";
import { userAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { fetchAllCategories, fetchUserCategoryIds } from "./categoryService";



const DisplaySelectedCategories = (profileId) => {
    const [allCategories, setAllCategories] = useState([]);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

    useEffect(async () => {
        const all = await fetchAllCategories();
        const selected = await fetchUserCategoryIds(userId);
    })

}