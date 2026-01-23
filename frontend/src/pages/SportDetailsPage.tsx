import { useParams } from "react-router-dom";

export const SportDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div>Sport Detail Page for {slug}</div>
  );
};
