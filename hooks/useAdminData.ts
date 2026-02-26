"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function useAdminData(key: string) {
    const [data, setData] = useState<any>(key === "settings" ? {} : []);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoaded(false);
            const { data: result, error } = await supabase
                .from(key)
                .select('*')
                .order('id', { ascending: true });

            if (error) {
                console.error(`Error fetching ${key}:`, error.message || JSON.stringify(error));
                return;
            }
            if (key === "settings") {
                setData(result[0] || {});
            } else {
                setData(result || []);
            }
            setIsLoaded(true);
        };

        fetchData();
    }, [key]);

    // Used mainly by settings which is a single row object
    const saveData = async (newData: any) => {
        const { error } = await supabase
            .from(key)
            .upsert({ id: newData.id || 1, ...newData });

        if (error) {
            console.error(`Error saving ${key}:`, error.message || JSON.stringify(error));
            alert("Erreur : " + (error.message || "Erreur de base de données"));
            return;
        }
        setData(newData);
    };

    const addItem = async (item: any) => {
        const { data: insertedData, error } = await supabase
            .from(key)
            .insert([item])
            .select();

        if (error) {
            console.error(`Error adding to ${key}:`, error.message || JSON.stringify(error));
            alert("Erreur : " + (error.message || "Erreur d'ajout"));
            return;
        }

        if (insertedData) {
            setData((prev: any) => [...prev, ...insertedData]);
        }
    };

    const updateItem = async (id: number, updatedItem: any) => {
        const { error } = await supabase
            .from(key)
            .update(updatedItem)
            .eq('id', id);

        if (error) {
            console.error(`Error updating ${key}:`, error.message || JSON.stringify(error));
            alert("Erreur : " + (error.message || "Erreur de mise à jour"));
            return;
        }

        setData((prev: any) => prev.map((item: any) => item.id === id ? { ...item, ...updatedItem } : item));
    };

    const deleteItem = async (id: number) => {
        const { error } = await supabase
            .from(key)
            .delete()
            .eq('id', id);

        if (error) {
            console.error(`Error deleting from ${key}:`, error.message || JSON.stringify(error));
            alert("Erreur : " + (error.message || "Erreur de suppression"));
            return;
        }

        setData((prev: any) => prev.filter((item: any) => item.id !== id));
    };

    return { data, isLoaded, addItem, updateItem, deleteItem, saveData };
}
