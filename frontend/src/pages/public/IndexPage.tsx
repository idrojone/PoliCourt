import { MainLayout } from "@/layout/main";
import { useSportsAllQuery } from "@/features/sport/queries/useSportsAllQuery";
export const IndexPage = () => {
  const sports = useSportsAllQuery();
  console.log(sports);
  return (
    <MainLayout>
      <div>Hola</div>
      {/*<HeroSection courts={courts.length} clubs={clubs.length} users={users.length}/>
      <CourtsSection courts={courts} sports={sportsResponse?.data || []} />
      <div className="container mx-auto py-12">
        <h2 className="text-3xl font-bold mb-6">Todos nuestros deportes</h2>
        <SportsList sports={sportsResponse?.data || []} isLoading={isSportsLoading} isError={isSportsError}/>
      </div>
      <ClubsSection clubs={clubs} isLoading={isClubsLoading} isError={isClubsError} />*/}
    </MainLayout>
  );
};
