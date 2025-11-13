---
title: "BioHackEU25 report: Scop3PTM Next - Interactive visualization of PTM data across sequence, structure and interactions"
title_short: "BioHackEU25 Project #22: Scop3PTM Next"
tags:
  - research methods in life sciences
  - proteomics
  - post-translational modification
  - ptm
  - structural biology
authors:
  - name: Pathmanaban Ramasamy
    orcid: 0000-0003-4039-5230
    affiliation:
      - 1
      - 2
      - 3
      - 4
      - 5
    role: Conceptualization, Data curation, Supervision, Validation, Resources, Visualization, Software, Writing – review & editing. 
  - name: Natalia Tichshenko
    orcid: 0000-0001-7914-0759
    affiliation:
      - 1
      - 2
      - 3
    role: Conceptualization, Data curation, Supervision, Validation, Resources, Visualization, Software, Writing – review & editing. 
  - name: Adrián Díaz
    orcid: 0000-0003-0165-1318
    affiliation:
      - 4
      - 5
    role: Conceptualization, Supervision, Resources, Validation, Visualization, Software, Writing – original draft.
  - name: Mahfouz Shehu
    orcid: 0009-0002-9470-0368
    affiliation: 6
    role: Methodology, Visualization, Software.
  - name: Yusuf Shehu
    orcid: 0009-0009-3732-7051
    affiliation: 7
    role: Methodology, Visualization, Software.
  - name: Elyse Cheng
    orcid: 0009-0007-6402-9709
    affiliation: 8
    role: Methodology, Visualization, Software.

affiliations:
 - name: VIB Structural Biology Research Centre, Brussels 1050, Belgium
   index: 1
 - name: VIB-UGent Center for Medical Biotechnology, VIB, Ghent 9000,Belgium
   index: 2
 - name: Department of Biomolecular Medicine, Ghent University, Ghent 9000, Belgium
   index: 3
 - name: Interuniversity Institute of Bioinformatics in Brussels, VUB/ULB, Brussels 1050, Belgium
   index: 4
 - name: Structural Biology Brussels, Vrije Universiteit Brussel, Brussels 1050, Belgium
   index: 5
 - name: EMBL-EBI, Wellcome Genome Campus, Hinxton, Cambridgeshire, CB10 1SD, United Kingdom
   index: 6
 - name: Computer Science department, Ahmadu Bello University, Community Market, Zaria 810211, Kaduna, Nigeria
   index: 7
 - name: St Hilda's College, University of Oxford, Cowley Place, Oxford, OX4 1DY, United Kingdom
   index: 8

date: 14 November 2025
bibliography: paper.bib
cito-bibliography: paper.bib
authors_short: "Ramasamy P. and Tichshenko N. and Díaz A. and Shehu M. and Shehu Y. and Cheng E."
group: "Project 22"
event: "BH25EU"
biohackathon_name: "BioHackathon Europe 2025"
biohackathon_url: "https://bioHackathon-europe.org"
biohackathon_location: "Berlin, Germany, 2025"
git_url: https://github.com/Bio2Byte/biohackathon-eu-2025-group-22

---

# Background

From Monday, 3 November 2025, to Friday, 7 November 2025, Project 22 conducted a series of technical activities aimed to enhance the visualisation components developed for the _Scop3P_ and _Scop3PTM_ projects. These collective efforts are referred to as _Scop3PTM Next_. The main goal of this project is to build an open library of visual components for the proteomics community.

_Scop3P_ is a comprehensive database of human phosphosites presented within their full biological context. It integrates protein sequences (UniProtKB/Swiss-Prot), structures (PDB), and uniformly reprocessed phosphoproteomics data (PRIDE) to annotate all known human phosphosites [@citesAsAuthority:Scop3P2020]. The resource is available at [https://iomics.ugent.be/scop3p](https://iomics.ugent.be/scop3p).

_Scop3P_ is currently being extended to _Scop3PTM_, which will provide a unique and powerful resource for understanding the impact of post-translational modification (PTM) sites on human protein structure–function relationships. While the original Scop3P system integrated 36 projects, 60.2 million processed spectra, and one modification type, the new system will encompass 539 projects, approximately 1 billion processed spectra, and more than 117 modification types.

Both _Scop3P_ and _Scop3PTM_ are developed by [_CompOmics_](http://compomics.com), a research group led by **Prof. Dr. Lennart Martens**. The group is part of the [Department of Biomolecular Medicine](https://www.ugent.be/ge/biomolecular-medicine/en) within the Faculty of Medicine and Health Sciences at Ghent University and is affiliated with the [VIB–UGent Center for Medical Biotechnology (VIB)](https://cmb.sites.vib.be/en), both located in Ghent, Belgium.

_CompOmics_ collaborates closely with the [_Bio2Byte_](https://bio2byte.be) laboratory, a structural biology research group based in Brussels and led by **Prof. Dr. Wim Vranken**. This lab is affiliated with the [VIB Structural Biology Research Centre](https://www.vubtechtransfer.be/structural-biology) and the [Interuniversity Institute of Bioinformatics in Brussels](http://ibsquare.be) (IB2).

For this edition of BioHackathon Europe, both laboratories, _CompOmics_ and _Bio2Byte_, joined forces to co-lead Project 22.

## Team organisation

During the kick-off meeting on Monday morning, the group outlined the project's objectives and the skills required from participants. The five-day project was divided into three tracks: linear plots, network representations and structural visualisations:

- Co-leader **Pathmanaban Ramasamy** (from _CompOmics_ group): attended in person.
  - Coordinated the tasks, provided example data files, the Jupyter Notebook document for the structural track and offered overall guidance for all the tracks.
- Co-leader **Natalia Tichshenko** (from _CompOmics_ group): attended in person.
  - Coordinated the tasks, provided example data files, offered overall guidance for all the tracks and contributed to the _Linear track_ development.
- Co-leader **Adrián Díaz** (from _Bio2Byte_ group): attended in person.
  - Coordinated the tasks, provided example data files, offered overall guidance for all the tracks and contributed to the _Structural track_ development.

![Presentation of Project #22's goals and required skills during the kick-off meeting on Monday.](./kickoff.jpeg){ width=350px }

By Tuesday morning, Project 22 had grown into a six-member team, with one member attending in person and the others participating remotely via the project's Zoom breakout room:

- **Mahfouz Shehu**: attended in person.
  - Contributed to the _Network track_ development.
- **Yusuf Shehu**: joined remotely from Nigeria.
  - Contributed to the _Network track_ development.
- **Elyse Cheng**: joined remotely from the United Kingdom.
  - Contributed to the _Structural track_ development.

The team held an internal kick-off meeting on Tuesday, followed by track-specific meetings to discuss the particular aspects of each visualisation component. Additional daily meetings were organised to monitor the progress of ongoing tasks.

![The complete group picture including on-site and online members.](./group.jpeg)

# Goals

The final goal of this project is a two-side pane canvas where one side contains the 3D/Structural view (in general to the right) while the other side contains linear or graphs representations of a given protein. We propose novel visualization ideas focusing on bridging sequence (1D), residue contact maps (2D), Residue Interaction Networks (RINs-2.5D) and protein structures (3D).

![The kick-off slide at the "flash presentation" meeting on Monday](./initial.jpeg)

## Technical Stack

We decided to build the components using the JavaScript programming language, based on the [`Node.js`](https://nodejs.org/en) [@citesAsAuthority:nodejs] runtime environment (LTS version `Jod`, specifically `v22.14.0`). To manage `Node.js` versions, we rely on [`nvm`](https://github.com/nvm-sh/nvm) [@citesAsAuthority:nvm].

The aim of the project was to develop an open-source library of visual components for proteomics projects. As a team requirement, we wanted to keep the implementation simple and as plug-and-play as possible. To meet these requirements, all visual representations were developed as [`Vue.js`](https://vuejs.org/guide/introduction.html) (version 3) components [@citesAsAuthority:vuejs].

With respect to dependencies, the project requires [`D3.js`](https://d3js.org) for the linear and network representations, `Nightingale Elements` [@citesAsAuthority:Nightingale2023] for positional tracks, and `MolStar` [@citesAsAuthority:Molstar2021] for the visualisation and analysis of large-scale molecular data. In particular, we used `MolSpecView` [@citesAsAuthority:molspecview2025] (referred as `MSV`) to generate the 3D views. The inclusion of `MSV` is a great example of new ideas after discussing with other groups during the working week at the venue. We hold several small discussions on the fly with Group 19, "MolViewSpec: A presentation layer for structural molecular data" and they taught how to start using `MSV` for our 3D rendering needs.

Given the goal was to distribute the components as a reusable library, all developments are encapsulated as [`Storybook`](https://storybook.js.org) UI components [@citesAsAuthority:storybook]. This JavaScript framework enables the creation of isolated components and interaction with them without the need to run the entire application.

To simplify both the development process and the learning curve, we created a [public repository](https://github.com/Bio2Byte/BioHackathon-eu-2025-group-22) containing example files for each track.

```bash
# Clone the repository to create a local copy in your environment
git clone git@github.com:Bio2Byte/biohackathon-eu-2025-group-22.git

# Navigate to the repository directory
cd biohackathon-eu-2025-group-22
```

This repository includes the setup for all referenced libraries, allowing any user to access and explore the visual component library through the Storybook framework.

```bash
# Set up the project's Node.js version as defined in the .nvmrc file (v22.14.0)
nvm use

# Install the npm dependencies
npm install

# Start the Storybook server
npm run storybook
```

The visual library will be accessible at http://localhost:6006. The left panel is organised into folders corresponding to the different tracks and their respective components. At the bottom, the parameters section allows users to modify the properties of the displayed component.

![The visual library of components generated using Storybook framework.](./storybook_3d.jpeg){ width=250px }

## Tracks

The first track focuses on improving the existing visualizations in Scop3PTM, by refining the 1D feature viewer for PTMs. It includes displaying multiple PTMs on the same residue with biological context (tissue, subcell, disease state) and peptide coverage maps from mass-spectrometry data. Then, the second track is centred on the network representations of the proteins, such as the contact maps. Finally, the third track, enhancing the MolStar viewer, improving 1D-3D linking, and adding biophysical features like ligand binding regions and PTM hot-spots.

### Linear track

This track is centred in 2D plots where the X-axis contains all the positions of a protein sequence. These plots cover multiple representations of positional values in the Y-axis. These plots are generated using the `D3.js` library.

- The *lollipop plot* for displaying positional modifications.
- The *peptides plot* for showing coverage derived from mass spectrometry data.

Both plots, developed by **Natalia Tichshenko**, are designed to be integrated within a container component called the `stacked view`, which enables shared tooltips and zooming across all stacked plots.

![Example of the lollipop component for positional values created by **Natalia Tichshenko**.](./lollipop.jpeg)

### Network track

This track focuses on node-edge representations as networks. For this BioHackathon, we decided to implement contact maps as the first visual component. This network renders the distances between all pairs of residues within a protein structure.

**Mahfouz Shehu** and **Yusuf Shehu** contributed to this track by converting the provided tabular data (TSV) into a JSON format suitable for network representation (nodes and edges) using the D3.js library. This work is available in the GitHub repository [ygs07/protein-d3-representation](https://github.com/ygs07/protein-d3-representation) and can be integrated into our Storybook visual library via npm (`vue-protein-network-visualizer`). The integration code is available on the branch `2025/november/feature/protein-network-visualisation`.

![The network component for contact maps created by **Mahfouz Shehu** and **Yusuf Shehu**.](./network.jpeg)

### Structural track

This track focuses on the `Nightingale` linear tracks and the protein's 3D structure. As a starting point, **Pathmanaban Ramasamy** shared a document in `Jupyter Notebook` format (an interactive document written in `Markdown` and `Python` code snippets) that generates a two-panel interface linking positional tracks to the 3D representation of the protein of interest.

**Elyse Cheng** contributed to this track by converting the Jupyter Notebook code into `Vue.js` (version 3) components corresponding to each `Nightingale` element, while **Adrián Díaz** implemented the `MolSpecView` library to render the 3D structure.

![Example of the tracks migrated by **Elyse Cheng*.](./combined_tracks.jpeg)

Additionally to the 3D structure, we included the [`Topology viewer`](https://github.com/PDBeurope/pdb-topology-viewer) part of the "PDB Component Library", to show connect the Nightingale tracks to the secondary structure of the protein of interest.

![The Topology viewer connected to the two-panel component.](./storybook_2d.jpeg)

# Social interactions

This project brought together a multidisciplinary team of participants with diverse backgrounds and experiences. It provided an opportunity to work in a hybrid setting, combining both on-site and online participation. The group included members working remotely from the UK and Nigeria.

On Wednesday, the on-site participants of the group presented its progress during the "Mid-week reporting poster session & coffee break" held in the main room of the venue. Our poster was designed to visually cover the ideas that emerged from social interactions, the group's shared vision and the progress of the hands-on work of the three different tracks.

![The hand-written poster elaborated for the "Mid-week reporting poster session & coffee break" on Wednesday afternoon.](./poster.jpeg){ width=250px }

# Discussion and conclusions

In addition to the technical work, the social interactions played a crucial role in broadening the group's collective understanding of visualisation components, requirements and best practices for providing the proteomics community with relevant tools.

We hope this BioHackathon Europe project marks the first step towards developing a collaborative suite of visual components that will be of lasting value to the proteomics community. The repository will remain open and under continuous development.

![The recap slide presented during the “Final Project Presentations” meeting on Friday morning.](./final.jpeg){ width=250px }

# Future work

## Leftovers 

Several tasks remain to be completed. Once these are finished, the _CompOmics_ team will implement the visual components on both the Scop3P and Scop3PTM websites:

1. Install and configure the npm package for the contact map.
2. Complete the conversion of the Jupyter Notebook's `Nightingale` components into `Vue.js` components.
3. Add support for overlapping/aligned structures.
4. Connect click events between both panels of the two-panel interface.

## Collaborations

TBC.

# Jupyter notebooks, GitHub repositories and data repositories

All tasks associated with this BioHackathon project are available in the official public repository hosted on GitHub. The repository contains the visual components, example datasets, and Storybook stories used to preview the components.

1. Project #22 description on [elixir-europe/biohackathon-projects-2025](https://github.com/elixir-europe/biohackathon-projects-2025): [Group 22](https://github.com/elixir-europe/biohackathon-projects-2025/blob/364145ab8d705846ef3c1d32ecdb091ea1153ec7/22.md).
2. Official public repository: [Bio2Byte/BioHackathon-eu-2025-group-22](https://github.com/Bio2Byte/BioHackathon-eu-2025-group-22).
3. Network repository: [ygs07/protein-d3-representation](https://github.com/ygs07/protein-d3-representation).
4. Network online demo: [Netlify App](https://vue-3-protein-visualizer-sample.netlify.app/).

# Acknowledgements

We would like to express our gratitude to everyone involved in _BioHackathon Europe 2025_ and to all the coordinators who made it possible. We also thank _ELIXIR Belgium_, _CompOmics_ and _Bio2Byte_ for their constant support and help us to be part of this BioHackathon edition.

Special thanks to Project #22's team members for their contributions throughout the week: Mahfouz, Yusuf and Elyse. The co-leaders of the group hope that everyone learned from and enjoyed the experience, whether participating in person or remotely.

Finally, we extend our appreciation to the staff of the _Hotel Esplanade Resort & Spa_ for their hospitality and excellent service during our stay at the venue.

# References
