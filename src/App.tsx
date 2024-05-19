import { Routes, Route } from 'react-router-dom';
import './globals.css';
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from './_root/pages';
import HeroPage from './_root/pages/HeroPage';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import SigninForm from './_auth/forms/SigninForm';
import SignupForm from './_auth/forms/SignupForm';
import ForgotPass from './_auth/forms/ForgotPass';

import { Toaster } from "@/components/ui/toaster"
import Discover from './_root/pages/Discover';
import PasswordRecovery from './_auth/forms/PasswordRecovery';

function App() {
  return (
    <>
          <main className="flex h-screen">
            <Routes>
              {/* Auth routes */}
              <Route element={<AuthLayout />}>
                <Route path="/sign-in" element={<SigninForm />} />
                <Route path="/sign-up" element={<SignupForm />} />
                <Route path="/forgot-pass" element={<ForgotPass />} />
                <Route path="/pass-recover" element={<PasswordRecovery />} />
                <Route path="/hero-page" element={<HeroPage/>}> </Route>
              </Route>

              {/* Root layout routes */}
              <Route element={<RootLayout />}>
              <Route index element={<Home />} />  
                <Route path="/home" element={<Home />} />
                <Route path="/discover" element={<Discover />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/saved" element={<Saved />} />
                <Route path="/all-users" element={<AllUsers />} />
                <Route path="/create-post" element={<CreatePost />} />
                <Route path="/update-post/:id" element={<EditPost />} />
                <Route path="/posts/:id" element={<PostDetails />} />
                <Route path="/profile/:id/*" element={<Profile />} />
                <Route path="/update-profile/:id" element={<UpdateProfile />} />    

                {/* Add other routes here */}
              </Route>
            </Routes>
            <Toaster />
          </main>
    </>
  );
}

export default App;
