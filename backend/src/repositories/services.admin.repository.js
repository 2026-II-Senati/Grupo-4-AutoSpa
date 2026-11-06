import { Service } from '../models/index.js';

export function findAllServices() { return Service.findAll({ order: [['id', 'ASC']], raw: true }); }
export function createService(data) { return Service.create(data, { returning: true }); }
export function findServiceById(id) { return Service.findByPk(id); }
