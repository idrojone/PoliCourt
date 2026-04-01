import { RegisterForm } from "@/features/auth/components/RegisterForm";
import modernFacilityImage from "@/assets/tennis-court-indoor-clay-surface-professional.jpg";
import { MainLayout } from "@/layout/main";

export const Register = () => {
  return (
    <MainLayout>
      <div 
        className="flex h-screen items-center justify-center bg-cover bg-center py-10 overflow-y-auto"
        style={{ backgroundImage: `url(${modernFacilityImage})` }}
      >
        <div className="z-10 relative mt-auto mb-auto">
          <RegisterForm />
        </div>
      </div>
    </MainLayout>
  );
};
