import ProfilePage from "../../profile/page";

export default function FrenchProfilePage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  return <ProfilePage searchParams={searchParams} locale="fr" />;
}
