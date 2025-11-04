---
title: "BioHackEU25 report: Scop3PTM Next - Interactive visualization of PTM data across sequence, structure and interactions"
title_short: "BioHackEU25 #22: Scop3PTM Next"
tags:
  - proteomics
  - ptm
  - structural biology
authors:
  - name: Pathmanaban Ramasamy
    orcid: 0000-0003-4039-5230
    affiliation: 
      - 1
      - 2
      - 3
      - 5
      - 6
  - name: Natalia Tichshenko
    orcid: 0000-0001-7914-0759
    affiliation: 
      - 1
      - 5
      - 6
  - name: Adrián Díaz
    orcid: 0000-0003-0165-1318
    affiliation: 
      - 2
      - 3
  - name: Mahfouz Shehu
    orcid: 0009-0002-9470-0368
    affiliation: 4
  - name: Yusuf Shehu
    orcid: 0009-0009-3732-7051
    affiliation: 8
  - name: Elyse Cheng
    orcid: 0009-0007-6402-9709
    affiliation: 7

affiliations:
 - name: VIB Structural Biology Research Centre, Brussels 1050, Belgium
   index: 1
 - name: Interuniversity Institute of Bioinformatics in Brussels, VUB/ULB, Brussels 1050, Belgium
   index: 2
 - name: Structural Biology Brussels, Vrije Universiteit Brussel, Brussels 1050, Belgium
   index: 3
 - name: EMBL-EBI, Wellcome Genome Campus, Hinxton, Cambridgeshire, CB10 1SD, United Kingdom
   index: 4
 - name: VIB-UGent Center for Medical Biotechnology, VIB, Ghent 9000,Belgium
   index: 5
 - name: Department of Biomolecular Medicine, Ghent University, Ghent 9000, Belgium
   index: 6
 - name: University of Oxford, United Kingdom
   index: 7
 - name: Computer Science department, Ahmadu Bello University, Community Market, Zaria 810211, Kaduna, Nigeria
   index: 8

date: 14 November 2025
bibliography: paper.bib
cito-bibliography: paper.bib
authors_short: "Ramasamy P. and Tichshenko N. and Díaz A. and Shehu M. and Shehu Y. and Cheng E."
group: "Project 22"
event: "BioHackathon Europe 2025"
biohackathon_name: "BioHackathon Europe 2025"
biohackathon_url: "https://biohackathon-europe.org"
biohackathon_location: "Berlin, Germany, 2025"
git_url: https://github.com/Bio2Byte/biohackathon-eu-2025-group-22

---

# Introduction or Background

From Monday, 3 November 2025, to Friday, 7 November 2025, Group 22 conducted a series of technical tasks aimed at improving the visualisation components developed by the Scop3P and Scop3PTM projects. These efforts are referred as Scop3PTM Next.

Scop3P is a comprehensive database of human phosphosites presented within their full biological context. It integrates protein sequences (UniProtKB/Swiss-Prot), structures (PDB), and uniformly reprocessed phosphoproteomics data (PRIDE) to annotate all known human phosphosites [@citesAsAuthority:Scop3P2020]. The resource is available at https://iomics.ugent.be/scop3p.

Scop3P is currently being extended to Scop3PTM, which will provide a unique and powerful resource for understanding the impact of PTM sites on human protein structure–function relationships. While the original Scop3P system integrated 36 projects, 60.2 million processed spectra, and one modification type, the new system will encompass 539 projects, approximately 1 billion processed spectra, and more than 117 modification artifacts.

Both Scop3P and Scop3PTM are developed by CompOmics, a research group led by Prof. Dr. Lennart Martens. CompOmics is part of the Department of Biomolecular Medicine within the Faculty of Medicine and Health Sciences at Ghent University, and is affiliated with the VIB-UGent Center for Medical Biotechnology (VIB), both located in Ghent, Belgium.

CompOmics collaborates closely with Bio2Byte, another Belgian research group based in Brussels and led by Prof. Dr. Wim Vranken. Bio2Byte is affiliated with the VIB Structural Biology Research Centre and the Interuniversity Institute of Bioinformatics in Brussels.

For the BioHackathon Europe 2025 in Berlin, Germany, both laboratories joined forces to co-lead Group 22, composed of:

- Pathmanaban Ramasamy (CompOmics) – attended in person; coordinated the tasks, provided data, and offered guidance.
- Natalia Tichshenko (CompOmics) – attended in person; contributed to the Linear track.
- Adrián Díaz (Bio2Byte) – attended in person; contributed to the 3D/Structural track.

This five-day project was structured into three visualisation tracks: linear representations, graph representations, and 3D/structural visualisations. On Monday, during the kick-off meeting, the group introduced the objectives and required skills to the participants.

By Tuesday, the team had expanded to include:

- Mahfouz Shehu – attended in person; contributed to the Graph track.
- Yusuf Shehu – joined remotely from Nigeria; contributed to the Graph track.
- Elyse Cheng – joined remotely from the United Kingdom; contributed to the 3D/Structural track.

In addition to the technical work, social interactions among participants helped broaden the group’s collective understanding of visualisation components.

## Technical Stack 

The aim of the hackathon is to build an open-source library of visual components for proteomics projects. The team wants to keep it simple and as plug-and-play as possible. To meet these requirements, all visual components are being developed as Vue.js (version 3) components, using a modern and widely adopted JavaScript framework.  

Regarding the visual JavaScript libraries, the components are built with **D3.js** for data visualisation, **Sigma/Graphology** for network representations, **Nightingale Elements** for linear tracks, and **MolStar**[@citesAsAuthority:Molstar2021] for 3D structure visualisation.  

Since the goal is to distribute the components as a reusable library, all developments are encapsulated as **Storybook** stories.

### Tracks

The final goal of this project is a two-side pane canvas where one side contains the 3D/Structural view (in general to the right) while the other side contains linear or graphs representations of a given protein. 

We propose novel visualization ideas focusing on bridging sequence (1D), residue contact maps (2D), Residue Interaction Networks (RINs-2.5D), and protein structures (3D). This includes displaying multiple PTMs on the same residue with biological context (tissue, subcell, disease state), peptide coverage maps from mass-spectrometry data, dynamic RINs linking PTMs and mutations, mutation proximity mapping in 3D, visualizing conformational diversity using representative structural states, and predictive visualizations of mutation-induced biophysical changes. The second track focuses on optimizing and improving existing visualizations in Scop3PTM, such as refining the 1D feature viewer for PTMs, enhancing the Mol* 3D viewer, improving 1D-3D linking, and adding biophysical features like ligand binding regions and PTM hot-spots.

### Track: Linear

This track contains the Lollypop, Peptides and stacked views. 

Natalia Tichshenko contributed to this track by adding the components in a stacked view inter-connecting the different linear visual components. This stacked view shares the zoom-in/out and it supports tooltips. 

### Track: Graphs

This track contains the Contacts map visualisation. 

Mahfouz Shehu and Yusuf Shehu contributed to this track by converting the provided tabular data (TSV) into a JSON format that can be represented as a network (nodes/edges) using D3.js library.

### Track: 3D/Structural

This track contains the Nightingale linear tracks while the 3D structure is rendered using MolStar. 

Elyse Cheng and Adrián Díaz contributed to this track by converting the JupyterNotebook code provided by Pathmanaban into Vue.JS (version 3) components.

# Social interactions

In addition to the excellent opportunity of working in a hybrid setup with in-site and online members, this section contain examples of relevant and helpful interactions during the week.

## Team composition

This project teamed up in a multidisciplinary group of people with diverse backgrounds and experiences. 

## F2F Discussions

These are the examples of talks taking place at the venue in the Splanade Hotel in Germany.
 
### MolStar brainstorming

TBC

### Dr. Davide Cirillo talk

Another example of a great knowledge exchange is a discussion during a breakfast where Dr. Cirillo provided us with publications and links to useful resources related to protein visualisation. 

# Discussion and/or Conclusion

TBC

# Future work

TBC

# Jupyter notebooks, GitHub repositories and data repositories

All the tasks involved in this hackathon project are included in the official public repository hosted on Github. It includes the visual components, example data and the StoryBook stories to preview the components.

1. Official public repository: [Bio2Byte/biohackathon-eu-2025-group-22](https://github.com/Bio2Byte/biohackathon-eu-2025-group-22)

# Acknowledgements

Thanks to all the people involved in the "BioHackathon Europe 2025" and all the ELIXIR collaborators who made it happen. Special thanks to our hackathon members for their contributions during the week. Kudos to all of them, the co-leaders of the group wish they learned and enjoy the experience either in person or remotely. Finally, thanks to the "Hotel Esplanade Resort & Spa" staff members for the accommodation and services provided to us.

We hope this is the first step in the journey of building a useful collaborative suite of visual components open to the proteomics community.

# References
