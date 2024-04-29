import { Routes, Route } from "react-router-dom";
import AuthLayout from "./_auth/AuthLayout";
import SignupForm from "@/_auth/forms/SignupForm";
import SigninForm from "@/_auth/forms/SigninForm";
import Home from "./pages/Home";
import { ThemeProvider } from "./components/ui/theme-provider";
import Profile from "./pages/Profile";
import ProfileEdit from "./pages/ProfileEdit";
import Confirm from "./pages/Confirm";
import GithubCont from "./pages/GithubCont";
import PrivateRoute from "./_components/Private";
import EmpSignupForm from "./_auth/forms/EmpSignupForm";
import Processing from "./_components/Processing";
import  {SkillAdd } from "./_components/SkillAdd";
import { LangAdd } from "./_components/LangAdd";
import { Project } from "./pages/Projects";
import { RepoProvider } from '@/context/Process';
import Internship from "./pages/Internship";
import Applied from "./pages/Applied";
import Matched from "./pages/Matched";
import AddInternship from "./_components/AddInternship";
import Emp from "./_components/Emp";
import ViewInternship from "./_components/ViewInternship";
import ViewPages from "./_components/ViewPages";
import Page from "./pages/Page";
import AppliedDetails from "./_components/AppliedDetails";
import AdminSignin from "./_auth/forms/AdminSignin";
import { AddSkill } from "./_components/AddSkill";
import { Companies } from "./_components/Companies";
import { UserInfo } from "./_components/UserInfo";
import SkillsEdit from "./_components/SkillsEdit";
import InternshipEdit from "./pages/InternshipEdit";
import { Projects } from "./_components/Projects";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Routes>
        {/* public routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<SigninForm />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/signup/employer" element={<EmpSignupForm />} />
            <Route path='/admin/login' element={<AdminSignin />} />
          </Route>

          <Route path='/skills' element={<LangAdd />}/>
          <Route path='/callback/:token' element={<GithubCont/>} />
          
        <Route  element={<PrivateRoute /> }>
          <Route path="/processing" element={<RepoProvider><Processing /></RepoProvider>} />
          <Route path='/repos' element={<RepoProvider><Project /></RepoProvider>}/>
          <Route path='/confirm' element={<Confirm />} />
          <Route path='/home' element={<Home />} />
          <Route path='/profile/:id' element={<Profile />} />
          <Route path='/profile/edit' element={<ProfileEdit />} />
          <Route path='/internship/:id' element={<Internship />} />
          <Route path='/page/:id' element={<Page />} />
          <Route path='/applied' element={<Applied />} />
          <Route path='/matched' element={<Matched />} />
          <Route path='/internship/create' element={ <AddInternship />} />
          <Route path='/page/create' element={ <Emp />} />
          <Route path='/internship/view' element={ <ViewInternship />} />
          <Route path='/pages' element={<ViewPages />} />
          <Route path='/add/skill' element={<AddSkill />} />
          <Route path='/data' element={<Companies />} />
          <Route path='/users' element={<UserInfo />} />
          <Route path='/skills/edit' element={<SkillsEdit />} />
          <Route path='/projects/:id' element={<Projects />} />
          </Route>
        </Routes>
      </ThemeProvider>
  )
}