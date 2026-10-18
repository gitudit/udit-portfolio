// The park sky: one fixed layer per land, cross-faded by scroll-driven animations tied to each
// land's view timeline (IntersectionObserver + data-land fallback). Stars at night, lights on the Midway.
export default function Sky() {
  return (
    <div className="sky" aria-hidden="true">
      <div className="sky__layer sky__layer--campus" />
      <div className="sky__layer sky__layer--training" />
      <div className="sky__layer sky__layer--thrill" />
      <div className="sky__layer sky__layer--midway" />
      <div className="sky__layer sky__layer--exit" />
      <div className="sky__stars" />
      <div className="sky__bokeh" />
    </div>
  );
}
