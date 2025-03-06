import { List, ListItem, ListItemButton, ListItemIcon,ListItemText, Divider } from "@mui/material";
//Importacion de iconos Icons Material
import { Dashboard, Groups, CalendarMonth, Assignment, Settings, Home, Person } from "@mui/icons-material";
import { Today, Analytics, School, SupervisorAccount, AccountCircle, } from "@mui/icons-material";


// Mapeo de navegación con sus respectivos iconos
const navigationConfig = {
  Inicio: { icon: <Home />, label: "Inicio" },
  Usuarios: { icon: <Groups />, label: "Usuarios" },
  Perfil: { icon: <Person />, label: "Perfil" },
  Fichas: { icon: <Dashboard />, label: "Fichas" },
  Agendamientos: { icon: <CalendarMonth />, label: "Agendamientos" },
  Visitas: { icon: <Today />, label: "Visitas" },
  Seguimiento: { icon: <Analytics />, label: "Seguimiento" },
  Reportes: { icon: <Assignment />, label: "Reportes" },
  Aprendiz: { icon: <School />, label: "Aprendiz" },
  SuperAdmin: { icon: <SupervisorAccount />, label: "Super Admin" },
  Instructor: { icon: <AccountCircle />, label: "Instructor" },
  Configuracion: { icon: <Settings />, label: "Configuración" },
};

// Configuración de permisos por rol
const rolePermissions = {
  SuperAdmin: [ "Usuarios", "Fichas", "Agendamientos", "Reportes", "Configuracion" ],
  Instructor: [ "Usuarios", "Fichas", "Agendamientos", "Reportes", "Configuracion"],
  Aprendiz: ["Inicio", "Perfil", "Visitas", "Seguimiento", "Configuracion"],
};


// Componente que muestra la lista de navegación
const NavigationList = ({ userRole }) => {
  
  // Obtener los elementos de navegación basados en el rol del usuario
  const navigationItems = rolePermissions[userRole] || [];
  return (
    <>
      {/* Header del rol actual */}
      <List sx={{ padding: 0 }}>
        <ListItem>
          <ListItemButton>
            <ListItemIcon sx={{ color: "text.primary" }}>
              {navigationConfig[userRole]?.icon}
            </ListItemIcon>
            <ListItemText primary={navigationConfig[userRole]?.label} />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />

      {/* Lista de navegación según permisos */}
      <List>
        {navigationItems.map((item) => (
          <ListItem key={item}>
            <ListItemButton>
              <ListItemIcon sx={{ color: "text.primary" }}>
                {navigationConfig[item]?.icon}
              </ListItemIcon>
              <ListItemText primary={navigationConfig[item]?.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default NavigationList;