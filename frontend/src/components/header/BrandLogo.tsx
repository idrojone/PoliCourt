import { Link } from "react-router-dom"

type BrandLogoProps = {
  className?: string
}

export const BrandLogo = ({ className }: BrandLogoProps) => {
  return (
    <div className={className ?? "mr-4 md:flex"}>
      <Link to="/" className="mr-6 flex items-center space-x-2">
        <span className="font-bold sm:inline-block text-xl">
          PoliCourt
        </span>
      </Link>
    </div>
  )
}
