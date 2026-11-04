import logoSuper from "../assets/logo-super.jpeg";

export function InicioPage() {
  return (
    <div className="inicio-page">
      <main className="inicio-content">
        <img
          className="inicio-logo"
          src={logoSuper}
          alt="Super Panadería, Confitería y Bombonería"
        />
      </main>
    </div>
  );
}
