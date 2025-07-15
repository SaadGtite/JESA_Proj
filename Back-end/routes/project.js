const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

router.post('/create', async (req, res) => {
  const {
    'responsible office': responsibleOffice,
    'name project': nameProject,
    'number project': numberProject,
    'project scope': projectScope,
    'manager constructor': managerConstructor,
    'manager' : manager,
    'review date': reviewDate,
    'review team members': reviewTeamMembers,
    'project members interviewed': projectMembersInterviewed
  } = req.body;

  const project = new Project({
    'responsible office': responsibleOffice,
    'name project': nameProject,
    'number project': numberProject,
    'project scope': projectScope,
    'manager constructor': managerConstructor,
    'manager' : manager,
    'review date': reviewDate,
    'review team members': reviewTeamMembers,
    'project members interviewed': projectMembersInterviewed
  });

  try {
    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Include GET routes if needed (from previous steps)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post('/:projectId/crrs', async (req, res) => {
  try {
    const { title } = req.body;
    const { projectId } = req.params;

    const section1Questions = [
  { text: 'Does the team have documented procedures?' },
  { text: 'Are the procedures up to date?' },
  { text: 'Are procedures reviewed periodically?' },
  { text: 'Are procedures accessible to all team members?' },
  { text: 'Do procedures cover all critical processes?' },
  { text: 'Are changes to procedures tracked?' },
  { text: 'Are obsolete procedures removed from circulation?' },
  { text: 'Are procedures approved by management?' },
  { text: 'Are responsibilities clearly defined in procedures?' },
  { text: 'Are there templates for creating new procedures?' },
  { text: 'Are procedures written in clear language?' },
  { text: 'Are procedures tested before implementation?' },
  { text: 'Is there training on using procedures?' },
  { text: 'Are deviations from procedures documented?' },
  { text: 'Is feedback on procedures collected from users?' },
  { text: 'Are procedures aligned with company policies?' },
  { text: 'Are procedures compliant with regulations?' },
  { text: 'Are there KPIs related to procedure adherence?' },
  { text: 'Are procedure owners assigned?' },
  { text: 'Are procedures available in digital format?' }
];
const section2Questions = [
  { text: 'Is risk assessment performed regularly?' },
  { text: 'Are mitigation plans documented?' },
  { text: 'Are risks prioritized by impact and likelihood?' },
  { text: 'Is risk assessment reviewed by management?' },
  { text: 'Are new projects assessed for risk?' },
  { text: 'Are residual risks documented?' },
  { text: 'Are historical risks tracked and analyzed?' },
  { text: 'Is there a risk register?' },
  { text: 'Are risk owners assigned?' },
  { text: 'Are mitigation plans tested?' },
  { text: 'Are risks updated when changes occur?' },
  { text: 'Is risk assessment methodology documented?' },
  { text: 'Are external risks considered?' },
  { text: 'Is training provided on risk management?' },
  { text: 'Are lessons learned used to update risk plans?' },
  { text: 'Are risk indicators monitored?' },
  { text: 'Are contingency plans developed for high risks?' },
  { text: 'Are risk assessments auditable?' },
  { text: 'Are stakeholders informed of key risks?' },
  { text: 'Are risk thresholds clearly defined?' }
];

const section3Questions = [
  { text: 'Is training provided to new employees?' },
  { text: 'Is training material reviewed annually?' },
  { text: 'Are training records maintained?' },
  { text: 'Is refresher training provided regularly?' },
  { text: 'Is training effectiveness evaluated?' },
  { text: 'Are trainers qualified?' },
  { text: 'Is on-the-job training documented?' },
  { text: 'Are training needs assessed periodically?' },
  { text: 'Is training aligned with job roles?' },
  { text: 'Are e-learning modules available?' },
  { text: 'Are employees required to complete mandatory training?' },
  { text: 'Are training attendance records kept?' },
  { text: 'Is feedback collected after training sessions?' },
  { text: 'Are external training sessions tracked?' },
  { text: 'Is specialized training provided for certain roles?' },
  { text: 'Is training updated for process changes?' },
  { text: 'Are training materials accessible online?' },
  { text: 'Is training part of employee onboarding?' },
  { text: 'Are there KPIs for training completion?' },
  { text: 'Is training budgeted annually?' }
];


   const section4Questions = [
  { text: 'Are deliverables tracked in a central system?' },
  { text: 'Are delivery dates updated?' },
  { text: 'Are deliverables reviewed before submission?' },
  { text: 'Are deliverable templates standardized?' },
  { text: 'Are delivery delays documented?' },
  { text: 'Are deliverables approved by stakeholders?' },
  { text: 'Is version control applied to deliverables?' },
  { text: 'Are deliverables archived securely?' },
  { text: 'Are deliverable quality criteria defined?' },
  { text: 'Are deliverables aligned with requirements?' },
  { text: 'Are deliverables validated by recipients?' },
  { text: 'Are deliverable dependencies identified?' },
  { text: 'Are delivery risks assessed?' },
  { text: 'Are deliverable changes communicated promptly?' },
  { text: 'Are metrics tracked for deliverable performance?' },
  { text: 'Are deliverables accessible to authorized users?' },
  { text: 'Are delivery milestones defined?' },
  { text: 'Is there a process for deliverable handover?' },
  { text: 'Are deliverables updated after stakeholder feedback?' },
  { text: 'Is compliance of deliverables monitored?' }
];


    // Build 4 sections
    const sections = [
      { title: 'Section 1', questions: section1Questions },
      { title: 'Section 2', questions: section2Questions },
      { title: 'Section 3', questions: section3Questions },
      { title: 'Section 4', questions: section4Questions }
    ];

    // Build the CRR
    const newCrr = { title, sections };

    // Find the project and add the CRR
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

   if (!Array.isArray(project.crrs)) {
  project.crrs = [];
    }

    project.crrs.push(newCrr);
    await project.save();

    res.status(201).json({ message: 'CRR created successfully', crr: newCrr });
  } catch (error) {
    console.error('Error creating CRR:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


module.exports = router;