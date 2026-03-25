type HeaderPageProps = {
  title: string;
  description: string;
  backgroundImage?: string;
};

export const HeaderPage = ({ title, description, backgroundImage }: HeaderPageProps) => {

    return (
      <section className="relative overflow-hidden py-12">
        {backgroundImage ? (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${backgroundImage}')` }}
          >
            <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/68 to-background" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-accent" />
        )}

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {title}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              {description}
            </p>
          </div>
        </div>
      </section>
    );
}