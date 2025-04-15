import { useContext } from "react";
import { ThemeContext } from "../components/ThemeContext";

function ThemeToggleButton() {
  const { toggleTheme, theme } = useContext(ThemeContext);

  const styles={
    toggle:{
      background:'white',
      position:'fixed',
      bottom:'75px',
      right:'25px'
    }
  }

  return (
    <button id="toggle-btn" style={styles.toggle} onClick={toggleTheme}>
      {theme === "light" ? "Dark" : "Light"} Mode
    </button>
  );
}
export default ThemeToggleButton;