import Grid from "@mui/material/Grid2";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";

//Componetes que hacen parte del layout 
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import { SidebarProvider } from "../context/SidebarContext";

const DashboardLayout = () => {

  return (
    <SidebarProvider>
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          height: "100vh",
          display: "grid",
          gridTemplateRows: "auto auto 1fr",
        }}
      >
        <Header />
        <Divider />
        <Box sx={{ flexGrow: 1, display: "flex" }}>
          <Grid container sx={{ height: "100%", overflow: "hidden" }}>
            <Grid xs={12} sm={2} sx={{ display: { xs: "none", sm: "block" } }}>
              {<Sidebar userRole={"Aprendiz"} />}
            </Grid>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ display: { xs: "none", sm: "block" } }}
            />
            <Grid xs={12} sm={9} md={10}>
              <Box
                sx={{ padding: "16px", width: "100%", boxSizing: "border-box" }}
              >
                {<Outlet />}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </SidebarProvider>
  );
};

export default DashboardLayout;
