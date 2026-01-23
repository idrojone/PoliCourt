import UserProfile from "@/features/auth/components/user-profile";
import { MainLayout } from "@/layout/main";

export const ProfilePage = () => {
  return (
    <MainLayout>
      <UserProfile />
    </MainLayout>
  );
}