import { Project, ProjectCatalog } from '../types';

export const projectCatalog: ProjectCatalog = {
  mainProjects: [
    {
      title: "Evo",
      description: "DNA sequence generation and analysis using evolutionary algorithms",
      path: "/evo",
      techStack: ["React", "API Integration"],
      features: ["DNA Sequence Generation", "Parameter Control", "Real-time Updates"],
      isVisualization: true
    },
    {
      title: "Test",
      description: "Testing environment for DNA/protein sequence generation",
      path: "/test",
      techStack: ["React", "API Integration"],
      features: ["Parameter Testing", "Sequence Generation", "Dashboard Interface"],
      isVisualization: true
    },
    {
      title: "Toy Evo",
      description: "Simplified DNA sequence generation and visualization",
      path: "/toy_evo",
      techStack: ["React"],
      features: ["DNA Viewer", "Color-coded Bases", "Interactive Interface"],
      isVisualization: true
    },
    {
      title: "FermiNet",
      description: "Quantum mechanical visualizations and simulations",
      path: "/ferminet",
      subProjects: [
        {
          title: "Electron Density",
          description: "3D visualization of hydrogen-like orbital electron density with interactive rotation and zoom capabilities.",
          path: "/ferminet/electron_density",
          techStack: ["Three.js"],
          features: ["3D rotation", "Zoom control", "Dynamic animation"],
          isVisualization: true
        },
        {
          title: "Observable Quantities",
          description: "Vector fields and density plots for quantum mechanical observable quantities.",
          path: "/ferminet/observable_quantities",
          techStack: ["Plotly.js"],
          features: ["Vector field visualization", "Density plots", "Interactive controls"],
          isVisualization: true
        },
        {
          title: "Wavefunction",
          description: "Interactive visualization of quantum wavefunctions and orbitals.",
          path: "/ferminet/wavefunction",
          techStack: ["Plotly.js"],
          features: ["Orbital Visualization", "Interactive Controls", "Real-time Updates"],
          isVisualization: true
        },
        {
          title: "Energy",
          description: "Energy convergence plots during model training with interactive data visualization.",
          path: "/ferminet/energy",
          techStack: ["Plotly.js"],
          features: ["Interactive plots", "Real-time updates", "Data filtering"],
          isVisualization: true
        },
        {
          title: "MCMC Sampling",
          description: "Interactive visualization of Markov Chain Monte Carlo sampling processes.",
          path: "/ferminet/mcmc_sampling",
          techStack: ["Plotly.js"],
          features: ["Parameter controls", "3D trajectories", "Real-time updates"],
          isVisualization: true
        }
      ]
    }
  ]
};
