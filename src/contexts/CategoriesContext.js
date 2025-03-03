// contexts/CategoriesContext.js
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from "../supabaseClient"; // Import your Supabase client

const CategoriesContext = createContext(null);

export const CategoriesProvider = ({ children }) => {
    const [categories, setCategories] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            setError(null);

            try {
                const { data: categoriesData, error: supabaseError } = await supabase.from("categories").select("*");

                if (supabaseError) {
                    throw supabaseError;
                }

                setCategories(categoriesData);
            } catch (err) {
                console.error("Error fetching categories:", err);
                setError(err.message || "Error fetching categories data.");
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const value = { categories, loading, error };

    return (
        <CategoriesContext.Provider value={value}>
            {children}
        </CategoriesContext.Provider>
    );
};

export default CategoriesContext;