import { listManagedServices, addService, editService } from '../services/services.admin.service.js';
import { validateServiceCreate, validateServicePatch } from '../validators/services.validator.js';

function validationError(details) { const error = new Error('Revisa los datos del servicio.'); error.httpStatus = 422; error.apiCode = 'VALIDATION_ERROR'; error.details = details; return error; }
function sendError(error, next) { next(error); }

export async function getManagedServices(_req, res, next) { try { res.status(200).json({ data: await listManagedServices() }); } catch (error) { sendError(error, next); } }
export async function createManagedService(req, res, next) { try { const result = validateServiceCreate(req.body); if (result.errors.length) throw validationError(result.errors); res.status(201).json({ data: await addService(result.value) }); } catch (error) { sendError(error, next); } }
export async function patchManagedService(req, res, next) { try { const result = validateServicePatch(req.body); if (result.errors.length) throw validationError(result.errors); res.status(200).json({ data: await editService(Number(req.params.id), result.value) }); } catch (error) { sendError(error, next); } }
