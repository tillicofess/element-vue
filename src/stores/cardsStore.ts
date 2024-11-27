import { defineStore } from "pinia";
import { ref } from "vue";
import axios from "axios";
interface Card {
  id: number;
  category?: "tutorial" | "tools";
  img_url?: string;
  title: string;
  description?: string;
  url: string;
  v_html_content?: string;
}
export const useCardsStore = defineStore("cards", () => {
  const currentcard = ref<Card>();
  const cards = ref<Card[]>([]);

  const fetchCards = async (category: "tutorial" | "tools") => {
    try {
      const response = await axios.get(
        `http://49.235.164.72:3000/cards/${category}`
        // `http://localhost:3000/cards/${category}`
      );
      cards.value = response.data;
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  const fetchCardsbyid = async (id: number) => {
    try {
      const response = await axios.get(
        `http://49.235.164.72:3000/cards/content/${id}`
        // `http://localhost:3000/cards/content/${id}`
      );
      currentcard.value = response.data;
    } catch (error) {
      console.error("Error fetching cards:", error);
    }
  };

  return {
    currentcard,
    fetchCardsbyid,
    cards,
    fetchCards,
  };
});
