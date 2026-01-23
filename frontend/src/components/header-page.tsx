export const HeaderPage = ({title, description}: {title: string, description: string}) => {

    return (
      <section className="relative bg-accent py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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