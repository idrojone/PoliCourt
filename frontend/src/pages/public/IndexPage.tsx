import { MainLayout } from "@/layout/main";
import { HeroSection } from "@/components/hero-section";
import { useCourtsActivePublishedQuery } from "@/features/court/queries/useCourtsActivePublishedQuery.fa";
import { useUsersActivePublishedUsers } from "@/features/auth/queries/useUsersActivePublishedUsers";
import { CourtsSection } from "@/features/court/components/court-section";
import { SportsList } from "@/features/sport/components/sports-list";
import { useSportsActivePublishedQuery } from "@/features/sport/queries/useSportsActivePublishedQuery";
export const IndexPage = () => {

  const courts = useCourtsActivePublishedQuery().data || [];
  const users = useUsersActivePublishedUsers().data || [];
  const sports = useSportsActivePublishedQuery().data || [];


  return (
    <MainLayout>
      <HeroSection courts={courts.length} clubs={0} users={users.length}/>
      <CourtsSection courts={courts} sports={sports} />
      <div className="container mx-auto py-12">
        <h2 className="text-3xl font-bold mb-6">Todos nuestros deportes</h2>
        <SportsList sports={sports} />
      </div>
      {/* <ClubsSection clubs={clubs} isLoading={isClubsLoading} isError={isClubsError} /> */}
    </MainLayout>
  );
};
