export default function CrossBackground() {
  return (
    <div
      className="absolute inset-0 -z-10 h-full w-full 
      [background:radial-gradient(circle,transparent_20%,var(--border)_20%,var(--border)_80%,transparent_80%,transparent),
               radial-gradient(circle,transparent_20%,var(--border)_20%,var(--border)_80%,transparent_80%,transparent)_25px_25px,
               linear-gradient(#444cf7_2px,transparent_2px)_0_-1px,
               linear-gradient(90deg,#444cf7_2px,var(--border)_2px)_-1px_0]
      [background-size:50px_50px,50px_50px,25px_25px,25px_25px]"
    ></div>
  )
}
