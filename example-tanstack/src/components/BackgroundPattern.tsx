export default function BackgroundPattern() {
  return (
    <section className="absolute inset-0 -z-10 h-full w-full" aria-hidden="true">
      <div
        className="absolute inset-0 h-full w-full 
      bg-[linear-gradient(to_right,var(--pattern-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--pattern-color)_1px,transparent_1px)] bg-[size:56px_56px] 
      [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#fff_70%,transparent_100%)]"
      ></div>
    </section>
  )
}
