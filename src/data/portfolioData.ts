import { PortfolioProject } from '../types';

/**
 * Portfolio Project Catalog
 * 
 * IMPORTANT: In accordance with our business and ethical guidelines:
 * We do NOT invent fictional client projects, fabricated results, fake URLs,
 * or fake client testimonials.
 * 
 * When new client work is completed and client approval is granted, records are added
 * via the Supabase database (table: portfolio_projects) with publication_status = 'published'.
 * 
 * If the database has no published records, the application displays an attractive,
 * professional empty state explaining the curation process and inviting prospective clients
 * to request relevant case references directly or site administrators to publish work.
 */

export const initialPortfolioProjects: PortfolioProject[] = [];
