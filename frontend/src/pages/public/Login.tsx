import { LoginForm } from "@/features/auth/components/LoginForm";
import modernFacilityImage from "@/assets/tennis-court-indoor-clay-surface-professional.jpg";
import { MainLayout } from "@/layout/main";

export const Login = () => {
  return (
    <MainLayout>
       <div 
      className="flex h-screen  items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${modernFacilityImage})` }}
    >
      <div className="z-10 relative">
        <LoginForm />
      </div>
    </div>
    </MainLayout>
  );
};
