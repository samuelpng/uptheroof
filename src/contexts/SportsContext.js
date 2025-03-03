import React, { createContext, useState, useEffect } from 'react';
import { supabase } from "../supabaseClient"; // Import your Supabase client

const SportsContext = createContext(null);

export const SportsProvider = ({ children }) => {
    const [sports, setSports] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Add error state

    useEffect(() => {
        const fetchSports = async () => {
            setLoading(true);
            setError(null); // Clear any previous errors

            try {
                const { data: sportsData, error: supabaseError } = await supabase.from("sports").select("*");

                if (supabaseError) {
                    throw supabaseError; // Re-throw the Supabase error for the catch block
                }

                setSports(sportsData);
            } catch (err) {
                console.error("Error fetching sports:", err);
                setError(err.message || "Error fetching sports data."); // Set the error message
            } finally {
                setLoading(false);
            }
        };

        fetchSports(); 
        // object style 
        // {
        //     "id": 0,
        //     "sport_name": ""
        // }
    }, []);

    const value = { sports, loading, error }; // Value to be provided

    return (
        <SportsContext.Provider value={value}>
            {children}
        </SportsContext.Provider>
    );
};

export default SportsContext;