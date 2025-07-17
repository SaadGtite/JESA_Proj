const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const mongoose = require('mongoose');

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

// Simplified questions arrays with only the 'text' attribute
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

router.post('/:projectId/crrs', async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title } = req.body;

    // Log request details for debugging
    console.log('CRR Request:', { projectId, title });

    // Validate input
    if (!title) {
      console.log('Validation failed: Missing title');
      return res.status(400).json({ message: 'Title is required' });
    }

    // Validate projectId format (MongoDB ObjectId)
    if (!projectId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log('Validation failed: Invalid projectId format');
      return res.status(400).json({ message: 'Invalid projectId format' });
    }

    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      console.log('Project not found for ID:', projectId);
      return res.status(404).json({ message: 'Project not found' });
    }

    // Ensure crrs array exists
    if (!Array.isArray(project.crrs)) {
      project.crrs = [];
    }

    // Build CRR with simplified sections
    const newCrr = {
      title,
      sections: [
        { title: 'Section 1', questions: section1Questions },
        { title: 'Section 2', questions: section2Questions },
        { title: 'Section 3', questions: section3Questions },
        { title: 'Section 4', questions: section4Questions }
      ]
    };

    // Add CRR to project and save
    project.crrs.push(newCrr);
    await project.save();

    console.log('CRR created successfully:', newCrr);
    res.status(201).json({ message: 'CRR created successfully', crr: newCrr });
  } catch (error) {
    console.error('Error creating CRR:', error.message, error.stack);
    res.status(500).json({ message: `Failed to create CRR: ${error.message}` });
  }
});

module.exports = router;
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

router.get('/:projectId/crrs/:crrId', async (req, res) => {
  try {
    const { projectId, crrId } = req.params;

    // Validate projectId
    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid projectId' });
    }

    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Find the specific CRR by its _id
    const crr = project.crrs.id(crrId);
    if (!crr) {
      return res.status(404).json({ message: 'CRR not found' });
    }

    // Extract the first section and its questions
    const section = crr.sections[0] || { questions: [] };
    const questions = section.questions || [];

    // Return only the relevant data (first section with all questions)
    res.json({
      sections: [{
        title: section.title || 'Section 1: Project Fundamentals',
        questions: questions.slice(0, 20) // Limit to 20 if more exist
      }]
    });
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