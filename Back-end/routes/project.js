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
  { text: 'Does the team have documented procedures?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are the procedures up to date?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are procedures reviewed periodically?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are procedures accessible to all team members?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Do procedures cover all critical processes?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are changes to procedures tracked?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are obsolete procedures removed from circulation?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are procedures approved by management?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are responsibilities clearly defined in procedures?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are there templates for creating new procedures?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are procedures written in clear language?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are procedures tested before implementation?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Is there training on using procedures?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are deviations from procedures documented?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Is feedback on procedures collected from users?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are procedures aligned with company policies?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are procedures compliant with regulations?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are there KPIs related to procedure adherence?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are procedure owners assigned?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are procedures available in digital format?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false }
];
const section2Questions = [
  { text: 'Is risk assessment performed regularly?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are mitigation plans documented?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are risks prioritized by impact and likelihood?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Is risk assessment reviewed by management?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are new projects assessed for risk?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are residual risks documented?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are historical risks tracked and analyzed?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Is there a risk register?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are risk owners assigned?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are mitigation plans tested?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are risks updated when changes occur?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Is risk assessment methodology documented?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are external risks considered?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Is training provided on risk management?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are lessons learned used to update risk plans?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are risk indicators monitored?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are contingency plans developed for high risks?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are risk assessments auditable?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are stakeholders informed of key risks?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are risk thresholds clearly defined?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false }
];

const section3Questions = [
  { text: 'Is training provided to new employees?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Is training material reviewed annually?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are training records maintained?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Is refresher training provided regularly?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Is training effectiveness evaluated?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are trainers qualified?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Is on-the-job training documented?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are training needs assessed periodically?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Is training aligned with job roles?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are e-learning modules available?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are employees required to complete mandatory training?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are training attendance records kept?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Is feedback collected after training sessions?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are external training sessions tracked?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Is specialized training provided for certain roles?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Is training updated for process changes?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are training materials accessible online?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Is training part of employee onboarding?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are there KPIs for training completion?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Is training budgeted annually?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false }
];
const section4Questions = [
  { text: 'Are deliverables tracked in a central system?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are delivery dates updated?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are deliverables reviewed before submission?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are deliverable templates standardized?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are delivery delays documented?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are deliverables approved by stakeholders?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Is version control applied to deliverables?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are deliverables archived securely?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are deliverable quality criteria defined?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are deliverables aligned with requirements?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are deliverables validated by recipients?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are deliverable dependencies identified?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are delivery risks assessed?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are deliverable changes communicated promptly?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are metrics tracked for deliverable performance?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are deliverables accessible to authorized users?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are delivery milestones defined?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Is there a process for deliverable handover?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Are deliverables updated after stakeholder feedback?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false },
  { text: 'Is compliance of deliverables monitored?', actions: [], refDoc: '', deliverable: '', score: null, comment: '', showstopper: false }
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

router.put('/:id', async (req, res) => {
  try {
    const {
      'responsible office': responsibleOffice,
      'name project': nameProject,
      'number project': numberProject,
      'project scope': projectScope,
      'manager constructor': managerConstructor,
      'manager': manager,
      'review date': reviewDate,
      'review team members': reviewTeamMembers,
      'project members interviewed': projectMembersInterviewed
    } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      {
        'responsible office': responsibleOffice,
        'name project': nameProject,
        'number project': numberProject,
        'project scope': projectScope,
        'manager constructor': managerConstructor,
        'manager': manager,
        'review date': reviewDate,
        'review team members': reviewTeamMembers,
        'project members interviewed': projectMembersInterviewed
      },
      { new: true } // pour retourner le projet modifié
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  console.log('Delete request for id:', req.params.id);
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);

    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: error.message });
  }
});

// GET /api/projects/:projectId/crrs/:crrId
router.get('/:projectId/crrs/:crrId', async (req, res) => {
  try {
    const { projectId, crrId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const crr = project.crrs.id(crrId); // cherche le CRR par son _id
    if (!crr) {
      return res.status(404).json({ message: 'CRR not found' });
    }

    res.json(crr);
  } catch (error) {
    console.error('Error fetching CRR:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PUT /api/projects/:projectId/crrs/:crrId/section/:sectionNumber
router.put('/:projectId/crrs/:crrId/section/:sectionNumber', async (req, res) => {
  try {
    const { projectId, crrId, sectionNumber } = req.params;
    const { questions } = req.body;

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const crr = project.crrs.id(crrId);
    if (!crr) return res.status(404).json({ message: 'CRR not found' });

    const sectionIndex = parseInt(sectionNumber) - 1;
    if (!crr.sections[sectionIndex]) return res.status(404).json({ message: 'Section not found' });

    // Remplace les questions de la section
    crr.sections[sectionIndex].questions = questions;

    await project.save();

    res.json({ message: 'Section updated successfully' });
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;