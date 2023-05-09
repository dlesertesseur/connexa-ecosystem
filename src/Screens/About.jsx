import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function About() {

    const navigate = useNavigate();
    return (
      <>
        <main>
          <h2>Who are we?</h2>
          <p>
            That feels like an existential question, don't you
            think?
          </p>
          <Button 
          onClick={(event) => {
            navigate("/menu/");
          }}
        >
          to Home
        </Button>
        </main>

      </>
    );
  }

  export default About;