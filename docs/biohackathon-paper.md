---
title: 'Scop3PTM Next: Interactive visualization of PTM data across sequence, structure and interactions'
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
authors_short: Last et al. (2021) BioHackrXiv template
group: 22
event: BioHackathon Europe 2025
---

# Introduction or Background

From Monday, the 3rd November 2025 to Friday, the 7th November 2025 the group number 22 conducted technical tasks to improve the visualisation components developed by Scop3P[TM] project. Both Scop3P and ScoP3PTM have been developed by CompOmics in Ghent, Belgium. CompOmics collaborates with another Belgian lab in Brussels, the Bio2Byte lab led by Prof. Wim Vranken. For the Bio Hackathon edition 2025 in Berlin, Germany, both labs joined forces to co-led the group 22:

- Pathmanaban Ramasamy (CompOmics), joined in person who coordinate the tasks, provides data and orientation.
- Natalia Tichshenko (CompOmics), joined in person who contributes in the Linear track
- Adrián Díaz (Bio2Byte), joined in person who contributes in the 3D/Structural track

This five-day project is divided in three so-called visual tracks: linear representations, graph representations and 3D/Structural visualisations. On Monday during the kick-off meeting, the group introduced the audience to the goals and required skills. 

By Tuesday, the team included these collaborators: 

- Mahfouz Shehu, joined in person who contributes in the Graph track 
- Yusuf Shehu, joined remotely from Nigeria who contributes in the Graph track 
- Elyse Cheng, joined remotely from the United Kingdom who contributes in the 3D/Structural track 

Besides the technical tasks, the social interactions contributed to extend the knowledge of visual components.

## Technical Stack 

The aim of the hackathon is to build an open-source library of visual components for proteomics projects. The team want to keep it simple and as plug-and-play as possible. To meet these requirements, it has been decided to build all the visual components as Vue.js components (version 3), a modern and relevant JavaScript framework. 

About the visual JavaScript libraries, the components are developed using d3.js plots, sigma/graphology for networks representations, nightingale-elements for linear tracks and MolStar for 3D structure visualisation

Given we want to distribute the components as a library, all our developments are wrapped in Storybook stories.

### Tracks

The final goal of this project is a two-side pane canvas where one side contains the 3D/Structural view (in general to the right) while the other side contains linear or graphs representations of a given protein. We propose novel visualization ideas focusing on bridging sequence (1D), residue contact maps (2D), Residue Interaction Networks (RINs-2.5D), and protein structures (3D). This includes displaying multiple PTMs on the same residue with biological context (tissue, subcell, disease state), peptide coverage maps from mass-spectrometry data, dynamic RINs linking PTMs and mutations, mutation proximity mapping in 3D, visualizing conformational diversity using representative structural states, and predictive visualizations of mutation-induced biophysical changes. The second track focuses on optimizing and improving existing visualizations in Scop3PTM, such as refining the 1D feature viewer for PTMs, enhancing the Mol* 3D viewer, improving 1D-3D linking, and adding biophysical features like ligand binding regions and PTM hotspots.

### Track: Linear

This track contains the Lollypop, Peptides and stacked views. 

Natalia Tichshenko contributed to this track by adding the components in a stacked view inter-conneting the different linear visual components. This stacked view shares the zoom-in/out and it supports tooltips. 

### Track: Graphs

This track contains the Contacts map visualisation. 

Mahfouz Shehu and Yusuf Shehu contributed to this track by converting the provided tabular data (TSV) into a JSON format that can be represented as a network (nodes/edges) using D3.js library.

### Track: 3D/Structural

This track contains the Nightingale linear tracks while the 3D structure is rendered using MolStar. 

Elyse Cheng and Adrián Díaz contributed to this track by converting the JupyterNotebook code provided by Pathmanaban into Vue.JS (version 3) components.

# Social interactions

TBC

## MolStar brainstorming

TBC

# Discussion and/or Conclusion

Importance of collaboration / discussions with other teams / shared ideas

## 

# Future work

And maybe you want to add a sentence or two on how you plan to continue. Please keep reading to learn about citations and references.

For citations of references, we prefer the use of parenthesis, last name and year. If you use a citation manager, Elsevier – Harvard or American Psychological Association (APA) will work. If you are referencing web pages, software or so, please do so in the same way. Whenever possible, add authors and year. We have included a couple of citations along this document for you to get the idea. Please remember to always add DOI whenever available, if not possible, please provide alternative URLs. You will end up with an alphabetical order list by authors’ last name.

# Jupyter notebooks, GitHub repositories and data repositories

All the tasks involved in this hackathon project are included in the official public repository hosted on Github. It includes the visual components, example data and the StoryBook stories to preview the components.

1. Official public repository: [Bio2Byte/biohackathon-eu-2025-group-22](https://github.com/Bio2Byte/biohackathon-eu-2025-group-22)

# Acknowledgements

Please always remember to acknowledge the BioHackathon, CodeFest, VoCamp, Sprint or similar where this work was (partially) developed.

# References

Leave this section blank, create a paper.bib with all your references.
