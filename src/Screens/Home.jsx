import { Button } from "@mantine/core";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <main>
        <h2>Welcome to the homepage!</h2>
        <p>You can do this, I believe in you.</p>

        <Button 
          onClick={(event) => {
            navigate("/menu/about");
          }}
        >
          to About
        </Button>
      </main>
    </>
  );
}

export default Home;
