import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  const isDarkMode = ref(false);

  /**
   * Toggles the dark mode state and updates the HTML class.
   */
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    localStorage.setItem('dark_mode', isDarkMode.value.toString());
    updateHtmlClass();
  };

  /**
   * Applies or removes the 'dark' class on the document's HTML element
   * and sets the color-scheme.
   */
  const updateHtmlClass = () => {
    const htmlElement = document.documentElement;
    if (isDarkMode.value) {
      htmlElement.classList.add('dark');
      htmlElement.style.colorScheme = 'dark';
    } else {
      htmlElement.classList.remove('dark');
      htmlElement.style.colorScheme = 'light';
    }
  };

  /**
   * Initializes dark mode based on localStorage or system preference.
   * Should be called once, typically in App.vue's onMounted or main.ts.
   */
  const initializeDarkMode = () => {
    const savedDarkMode = localStorage.getItem('dark_mode');
    if (savedDarkMode !== null) {
      isDarkMode.value = savedDarkMode === 'true';
    } else {
      isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
      isDarkMode.value = savedDarkMode === 'true';

    updateHtmlClass();
  };

  return {
    isDarkMode,
    toggleDarkMode,
    initializeDarkMode,
  };
});
