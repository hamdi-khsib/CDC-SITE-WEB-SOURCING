import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import HomePage from "scenes/homePage"
import LoginPage from "./scenes/auth/LoginForm"
import ProfilePage from "scenes/profilePage"
import { useMemo } from "react"
import { useSelector } from "react-redux"
import { CssBaseline } from "@mui/material"
import { ThemeProvider ,createTheme } from "@mui/material/styles"
import { themeSettings } from "./theme"
import PersistLogin from './scenes/auth/PersistLogin'
import RequireAuth from './scenes/auth/RequireAuth'
import { ROLES } from './config/roles'
import Prefetch from './scenes/auth/Prefetch'

function App() {
    const mode = useSelector((state) => state.mode)
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])

    return <div className="app">
            <ThemeProvider theme={theme}>
                <CssBaseline />    
                <Routes>
                    <Route path="login" element={<LoginPage />} />
                    <Route element={<PersistLogin />}>
                      <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]}/>}>
                          <Route element={<Prefetch />}>
                            <Route path="home" element={< HomePage />} />
                            <Route path="profile/:userId" element={< ProfilePage />} />
                          </Route>
                      </Route>  
                    </Route>   
                </Routes>           
            </ThemeProvider>
    </div>
}

export default App