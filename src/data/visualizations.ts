export const visualizations = [
  {
    title: "Electron Density",
    description: "3D visualization of hydrogen-like orbital electron density with interactive rotation and zoom capabilities.",
    path: "/electron_density",
    techStack: ["Three.js"],
    features: ["3D rotation", "Zoom control", "Dynamic animation"]
  },
  {
    title: "FermiNet Energy",
    description: "Energy convergence plots during model training with interactive data visualization.",
    path: "/ferminet/energy",
    techStack: ["Plotly.js"],
    features: ["Interactive plots", "Real-time updates", "Data filtering"]
  },
  {
    title: "MCMC Sampling",
    description: "Interactive visualization of Markov Chain Monte Carlo sampling processes.",
    path: "/ferminet/mcmc_sampling",
    techStack: ["Plotly.js"],
    features: ["Parameter controls", "3D trajectories", "Real-time updates"]
  },
  {
    title: "Observable Quantities",
    description: "Vector fields and density plots for quantum mechanical observable quantities.",
    path: "/ferminet/observable_quantities",
    techStack: ["Plotly.js"],
    features: ["Vector field visualization", "Density plots", "Interactive controls"]
  }
];
