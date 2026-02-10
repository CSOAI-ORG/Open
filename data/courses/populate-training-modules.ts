/**
 * Script to populate training_modules table with all 7 modules per course
 * This syncs the modules JSON field from courses table to the training_modules table
 */

import { getDb } from '../server/db';
import { trainingModules, courses } from '../drizzle/schema';
import { eq, inArray } from 'drizzle-orm';

interface ModuleJson {
  title: string;
  durationMinutes: number;
}

// Module content templates for each course
const moduleContentTemplates: Record<number, string[]> = {
  100001: [ // EU AI Act Fundamentals
    "This module introduces the European Union's Artificial Intelligence Act, providing a comprehensive overview of its scope, objectives, and key provisions. You'll learn about the regulatory framework designed to ensure AI systems are safe, transparent, and respect fundamental rights.",
    "Learn about the EU AI Act's risk-based classification system that categorizes AI systems into four levels: unacceptable risk, high risk, limited risk, and minimal risk. Understand how different AI applications are classified and what requirements apply to each category.",
    "This module covers the detailed requirements for high-risk AI systems, including conformity assessments, technical documentation, quality management systems, and post-market monitoring obligations.",
    "Explore the AI practices that are completely prohibited under the EU AI Act, including social scoring systems, real-time biometric identification in public spaces, and manipulative AI techniques.",
    "Understand the enforcement mechanisms of the EU AI Act, including the role of national competent authorities, market surveillance, and the penalties for non-compliance.",
    "Learn practical strategies for implementing EU AI Act compliance within your organization, including gap analysis, documentation requirements, and building a compliance roadmap.",
    "Prepare for the certification exam with comprehensive review materials, practice questions, and key concepts summary covering all aspects of the EU AI Act."
  ],
  100002: [ // NIST AI RMF Fundamentals
    "This module provides a comprehensive introduction to the NIST AI Risk Management Framework, its development history, core principles, and how it integrates with existing risk management practices in organizations.",
    "Learn about the GOVERN function which establishes the organizational context for AI risk management, including governance structures, policies, and accountability mechanisms.",
    "Explore the MAP function that helps organizations identify and categorize AI risks, understand the AI system context, and map potential impacts across stakeholders.",
    "Understand the MEASURE function which provides methodologies for assessing and analyzing AI risks, including metrics, testing approaches, and evaluation criteria.",
    "Learn about the MANAGE function that covers risk response strategies, mitigation measures, and continuous monitoring of AI systems throughout their lifecycle.",
    "This module covers practical implementation guidance, best practices, and real-world case studies for applying the NIST AI RMF in various organizational contexts.",
    "Prepare for the certification exam with comprehensive review materials, practice questions, and key concepts summary covering all aspects of the NIST AI RMF."
  ],
  100003: [ // UK AI Safety Institute Framework
    "Explore the UK's approach to AI regulation, including the pro-innovation regulatory framework, sector-specific guidance, and the role of existing regulators in overseeing AI systems.",
    "Learn about the UK AI Safety Institute's mission, structure, and key initiatives in advancing AI safety research, evaluation, and international collaboration.",
    "This module covers the testing and evaluation methodologies used by the AI Safety Institute, including red-teaming, capability assessments, and safety benchmarks.",
    "Understand the core safety assurance principles for AI systems, including robustness, reliability, transparency, and alignment with human values.",
    "Learn about UK-specific compliance requirements, including data protection obligations, sector-specific regulations, and voluntary commitments for AI developers.",
    "Explore real-world case studies demonstrating the application of UK AI safety principles across different sectors and use cases.",
    "Prepare for the certification exam with comprehensive review materials, practice questions, and key concepts summary covering all aspects of UK AI safety."
  ],
  100004: [ // Canada AIDA Compliance
    "This module introduces Canada's Artificial Intelligence and Data Act (AIDA), its legislative context, scope, and key objectives in regulating AI systems.",
    "Learn about the classification of high-impact AI systems under AIDA, including criteria for designation and the specific requirements that apply to these systems.",
    "Understand the risk mitigation requirements for AI systems, including impact assessments, bias testing, and measures to address potential harms.",
    "Explore the transparency and accountability obligations under AIDA, including disclosure requirements, explainability standards, and record-keeping duties.",
    "Learn about the enforcement mechanisms and penalties under AIDA, including the role of the AI and Data Commissioner and potential sanctions for non-compliance.",
    "This module provides a practical roadmap for implementing AIDA compliance, including timelines, resource planning, and integration with existing governance frameworks.",
    "Prepare for the certification exam with comprehensive review materials, practice questions, and key concepts summary covering all aspects of AIDA compliance."
  ],
  100005: [ // Australia AI Ethics Framework
    "Learn about Australia's eight AI Ethics Principles and how they guide the responsible development and deployment of AI systems across sectors.",
    "Explore Australia's Voluntary AI Safety Standard and its practical guidance for organizations developing and deploying AI systems.",
    "Understand the intersection of AI and privacy law in Australia, including the Privacy Act requirements and emerging data protection considerations.",
    "This module covers fairness and non-discrimination requirements for AI systems, including bias detection, mitigation strategies, and equity considerations.",
    "Learn about transparency and explainability requirements for AI systems, including disclosure obligations and methods for making AI decisions understandable.",
    "Explore practical implementation guidelines for applying Australia's AI ethics framework within organizations, including governance structures and assessment tools.",
    "Prepare for the certification exam with comprehensive review materials, practice questions, and key concepts summary covering all aspects of Australian AI ethics."
  ],
  100006: [ // ISO 42001 International Standard
    "This module introduces ISO/IEC 42001, the international standard for AI management systems, including its scope, structure, and relationship to other management system standards.",
    "Learn about the core requirements for establishing, implementing, and maintaining an AI management system, including leadership commitment and organizational context.",
    "Understand the risk management requirements of ISO 42001, including risk identification, assessment, treatment, and the implementation of controls.",
    "Explore the documentation and records requirements for ISO 42001 compliance, including policies, procedures, and evidence of conformity.",
    "Learn about internal audit requirements and management review processes for maintaining and improving the AI management system.",
    "Understand the certification process for ISO 42001, including preparation, audit stages, and maintaining certification over time.",
    "This module covers continuous improvement methodologies for AI management systems, including corrective actions, preventive measures, and performance optimization."
  ],
  100007: [ // China TC260 AI Framework
    "Learn about China's TC260 (National Information Security Standardization Technical Committee) and its role in developing AI governance standards and frameworks.",
    "Understand China's three-tier risk classification system for AI systems and the specific requirements that apply to each risk level.",
    "Explore the AI algorithm registration requirements in China, including the registration process, documentation requirements, and ongoing compliance obligations.",
    "Learn about data security requirements for AI systems in China, including data classification, protection measures, and cross-border data transfer restrictions.",
    "Understand the compliance and auditing requirements for AI systems operating in China, including self-assessments, third-party audits, and regulatory inspections.",
    "Explore the rules governing cross-border data transfers involving AI systems, including security assessments and contractual requirements.",
    "Prepare for the certification exam with comprehensive review materials, practice questions, and key concepts summary covering all aspects of China's TC260 framework."
  ]
};

async function main() {
  const db = await getDb();
  if (!db) {
    console.error('Database not available');
    process.exit(1);
  }

  // Get all 7 main courses with their modules JSON
  const coursesData = await db.select({
    id: courses.id,
    title: courses.title,
    modules: courses.modules,
  })
  .from(courses)
  .where(inArray(courses.id, [100001, 100002, 100003, 100004, 100005, 100006, 100007]));

  console.log(`Found ${coursesData.length} courses to process`);

  for (const course of coursesData) {
    const modulesJson = course.modules as ModuleJson[] | null;
    if (!modulesJson || modulesJson.length === 0) {
      console.log(`Course ${course.id} (${course.title}) has no modules JSON, skipping`);
      continue;
    }

    console.log(`\nProcessing course ${course.id} (${course.title}) with ${modulesJson.length} modules`);

    // Delete existing training modules for this course
    await db.delete(trainingModules).where(eq(trainingModules.courseId, course.id));
    console.log(`  Deleted existing modules`);

    // Get content templates for this course
    const contentTemplates = moduleContentTemplates[course.id] || [];

    // Insert new training modules
    for (let i = 0; i < modulesJson.length; i++) {
      const module = modulesJson[i];
      const code = `${course.id}-M${String(i + 1).padStart(2, '0')}`;
      const content = contentTemplates[i] || `This module covers ${module.title} as part of the ${course.title} course.`;
      
      await db.insert(trainingModules).values({
        code,
        title: module.title,
        description: `Module ${i + 1} of ${course.title}`,
        content,
        orderIndex: i,
        durationMinutes: module.durationMinutes,
        isRequired: 1,
        isActive: 1,
        courseId: course.id,
      });
      
      console.log(`  Added module ${i + 1}: ${module.title} (${module.durationMinutes} min)`);
    }
  }

  console.log('\nDone! All training modules have been populated.');
  process.exit(0);
}

main().catch(console.error);
