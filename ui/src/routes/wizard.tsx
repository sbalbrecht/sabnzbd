import { FileRoute, Outlet } from "@tanstack/react-router";
import logo from "/logo-full.svg";

export const Route = new FileRoute("/wizard").createRoute({
  component: WizardComponent,
});

function WizardComponent() {
  return (
    <>
      <div id="logo">
        <img src={logo} alt="SABnzbd" />
      </div>
      <Outlet />
    </>
  );
}
