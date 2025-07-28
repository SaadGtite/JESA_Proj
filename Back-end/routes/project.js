const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const mongoose = require('mongoose');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');



// Add body parser middleware
router.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
router.use(bodyParser.json()); // Parse JSON data (optional, for other routes)

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Unique filename
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Route to create a project
router.post('/create', upload.single('picture'), async (req, res) => {
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
      'project members interviewed': projectMembersInterviewed,
      location,
      sectorManager,
    } = req.body;

    // Convert reviewDate to Date object if provided
    const parsedReviewDate = reviewDate ? new Date(reviewDate) : new Date();

    // Prepare project data
    const projectData = {
      'responsible office': responsibleOffice,
      'name project': nameProject,
      'number project': numberProject,
      'project scope': projectScope,
      'manager constructor': managerConstructor,
      'manager': manager,
      'review date': parsedReviewDate,
      'review team members': reviewTeamMembers ? (Array.isArray(reviewTeamMembers) ? reviewTeamMembers : [reviewTeamMembers]) : [],
      'project members interviewed': projectMembersInterviewed ? (Array.isArray(projectMembersInterviewed) ? projectMembersInterviewed : [projectMembersInterviewed]) : [],
      location: location || null, // Optional field
      sectorManager: sectorManager || 'Other', // Default from schema if not provided
    };

    // Handle image upload
    if (req.file) {
      projectData.picture = `/uploads/${req.file.filename}`; // Store relative path
    }

    // Create and save the project
    const project = new Project(projectData);
    const savedProject = await project.save();

    res.status(201).json(savedProject);
  } catch (error) {
    console.error('Error creating project:', error);
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
router.put('/:id', upload.single('picture'), async (req, res) => {
  try {
    console.log('Received body:', req.body); // Debug: Log raw body
    const {
      'responsible office': responsibleOffice,
      'name project': nameProject,
      'number project': numberProject,
      'project scope': projectScope,
      'manager constructor': managerConstructor,
      'manager': manager,
      'review date': reviewDate,
      'review team members': reviewTeamMembers,
      'project members interviewed': projectMembersInterviewed,
      location,
      sectorManager,
      picture: pictureFromBody,
    } = req.body;

    // Validate required fields
    if (!responsibleOffice || responsibleOffice.trim() === '') {
      return res.status(400).json({ message: 'Responsible Office is required and cannot be empty' });
    }
    if (!nameProject || nameProject.trim() === '') {
      return res.status(400).json({ message: 'Project Name is required and cannot be empty' });
    }

    // Parse JSON strings for team members and validate
    let reviewTeamArray, interviewTeamArray;
    try {
      reviewTeamArray = reviewTeamMembers
        ? typeof reviewTeamMembers === 'string'
          ? JSON.parse(reviewTeamMembers)
          : Array.isArray(reviewTeamMembers)
          ? reviewTeamMembers
          : [reviewTeamMembers]
        : [];
      interviewTeamArray = projectMembersInterviewed
        ? typeof projectMembersInterviewed === 'string'
          ? JSON.parse(projectMembersInterviewed)
          : Array.isArray(projectMembersInterviewed)
          ? projectMembersInterviewed
          : [projectMembersInterviewed]
        : [];
    } catch (error) {
      return res.status(400).json({ message: 'Invalid format for team members: must be valid JSON or array' });
    }

    // Validate non-empty team member arrays
    if (!Array.isArray(reviewTeamArray) || reviewTeamArray.length === 0) {
      return res.status(400).json({ message: 'At least one Review Team Member is required' });
    }
    if (!Array.isArray(interviewTeamArray) || interviewTeamArray.length === 0) {
      return res.status(400).json({ message: 'At least one Interviewed Team Member is required' });
    }

    // Validate team member format (each should have name and role)
    const validateTeamMembers = (members, fieldName) => {
      if (!members.every(member => member && typeof member === 'object' && member.name && member.role)) {
        throw new Error(`${fieldName} must contain objects with 'name' and 'role' properties`);
      }
    };
    validateTeamMembers(reviewTeamArray, 'Review Team Members');
    validateTeamMembers(interviewTeamArray, 'Interviewed Team Members');

    // Validate project ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid project ID format' });
    }

    // Prepare update data
    const updateData = {
      'responsible office': responsibleOffice,
      'name project': nameProject,
      'number project': numberProject || undefined,
      'project scope': projectScope || undefined,
      'manager constructor': managerConstructor || undefined,
      'manager': manager || undefined,
      'review date': reviewDate ? new Date(reviewDate) : undefined,
      'review team members': reviewTeamArray,
      'project members interviewed': interviewTeamArray,
      location: location || undefined,
      sectorManager: sectorManager || undefined,
    };

    // Handle picture update
    if (req.file) {
      updateData.picture = `/uploads/${req.file.filename}`; // Update with new image path
      console.log('Updated picture with new file:', updateData.picture);
    } else if (pictureFromBody && typeof pictureFromBody === 'string') {
      updateData.picture = pictureFromBody; // Retain existing picture path
      console.log('Retained picture path:', pictureFromBody);
    }

    // Remove undefined values to avoid overwriting existing data
    Object.keys(updateData).forEach((key) => updateData[key] === undefined && delete updateData[key]);

    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error.message, error.stack);
    res.status(400).json({ message: `Failed to update project: ${error.message}` });
  }
});

router.delete('/:id', async (req, res) => {
  console.log('Delete request for id:', req.params.id);
  try {
    // Validate project ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid project ID format' });
    }

    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Project deleted successfully' });

    if (!deletedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Optional: Log CRR sections only if they exist
    if (deletedProject.crrs && Array.isArray(deletedProject.crrs) && deletedProject.crrs.length > 0 && deletedProject.crrs[0].sections && deletedProject.crrs[0].sections.length > 0) {
      console.log('Section with raw questions:', JSON.stringify(deletedProject.crrs[0].sections[0], null, 2));
    }

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error.message, error.stack);
    res.status(500).json({ message: `Failed to delete project: ${error.message}` });
  }
});

router.get('/:projectId/crrs/:crrId', async (req, res) => {
  try {
    const { projectId, crrId } = req.params;
    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const crr = project.crrs.id(crrId);
    if (!crr) return res.status(404).json({ message: 'CRR not found' });

   const sectionsWithVirtuals = crr.sections.map(section => {
  const sectionJSON = section.toJSON();
  return sectionJSON;
});

res.json({ sections: sectionsWithVirtuals });


  } catch (error) {
    console.error('Error fetching CRR:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.put('/:projectId/crrs/:crrId/section/:sectionNumber', async (req, res) => {
  try {
    const { projectId, crrId, sectionNumber } = req.params;
    const { questions } = req.body;

    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ message: 'Questions must be an array' });
    }

    const sectionIndex = parseInt(sectionNumber) - 1;
    if (isNaN(sectionIndex) || sectionIndex < 0) {
      return res.status(400).json({ message: 'Invalid section number' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const crr = project.crrs.id(crrId);
    if (!crr) {
      return res.status(404).json({ message: 'CRR not found' });
    }

    if (!crr.sections[sectionIndex]) {
      return res.status(404).json({ message: `Section ${sectionNumber} not found` });
    }

    // Update existing questions selectively
    for (const newQ of questions) {
      const existingQ = crr.sections[sectionIndex].questions.find(q => q._id.toString() === newQ._id);
      if (existingQ) {
        existingQ.text = newQ.text || existingQ.text;
        existingQ.actions = newQ.actions || existingQ.actions;
        existingQ.referenceDocument = newQ.referenceDocument || existingQ.referenceDocument;
        existingQ.deliverable = newQ.deliverable || existingQ.deliverable;
        existingQ.score = newQ.score !== undefined ? newQ.score : existingQ.score;
        existingQ.isNA = newQ.isNA !== undefined ? newQ.isNA : existingQ.isNA;
        existingQ.showstopper = newQ.showstopper !== undefined ? newQ.showstopper : existingQ.showstopper;
        existingQ.comments = newQ.comments || existingQ.comments;
      } else {
        console.warn(`Question with _id ${newQ._id} not found, skipping`);
      }
    }

    await project.save();
    res.json({ message: 'Section updated successfully' });
  } catch (error) {
    console.error('Error updating section:', error);
    res.status(500).json({ message: 'Internal server error', details: error.message });
  }
});

module.exports = router;