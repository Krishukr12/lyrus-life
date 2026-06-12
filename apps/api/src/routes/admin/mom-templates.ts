import { Router } from "express";
import { UserRole } from "@lyrus/db";
import { createMomTemplateSchema, updateMomTemplateSchema } from "@lyrus/shared";
import { zodErrorMessage } from "../../lib/api-errors.js";
import { asyncHandler } from "../../lib/http.js";
import { MOM_TEMPLATE_PRESETS } from "../../lib/mom-template-presets.js";
import {
  serializeMomTemplate,
  serializeMomTemplatePreset,
} from "../../lib/mom-template-serializer.js";
import { requireRouteParam } from "../../lib/route-params.js";
import { authorize } from "../../middleware/authorize.js";
import { requireAuthUser } from "../../middleware/authenticate.js";
import { momTemplateUpload } from "../../lib/upload.js";
import {
  MomTemplateServiceError,
  momTemplateService,
} from "../../services/mom-template.service.js";

export function createAdminMomTemplatesRouter(): Router {
  const router = Router();

  router.get(
    "/admin/mom-templates/presets",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (_req, res) => {
      res.json({
        presets: MOM_TEMPLATE_PRESETS.map(serializeMomTemplatePreset),
      });
    }),
  );

  router.get(
    "/admin/organizations/:organizationId/mom-templates",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      const includeArchived = req.query.includeArchived === "true";
      const templates = await momTemplateService.listTemplates(organizationId, includeArchived);
      res.json({ items: templates.map(serializeMomTemplate) });
    }),
  );

  router.get(
    "/admin/organizations/:organizationId/mom-templates/:templateId",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
      const templateId = requireRouteParam(req.params.templateId, "templateId");
      const template = await momTemplateService.getTemplate(organizationId, templateId);
      res.json({ template: serializeMomTemplate(template) });
    }),
  );

  router.post(
    "/admin/organizations/:organizationId/mom-templates",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const parsed = createMomTemplateSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "validation_error",
          message: zodErrorMessage(parsed.error),
        });
        return;
      }

      try {
        const actor = requireAuthUser(req);
        const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
        const template = await momTemplateService.createTemplate(
          actor.id,
          organizationId,
          parsed.data,
        );
        res.status(201).json({ template: serializeMomTemplate(template) });
      } catch (err) {
        if (err instanceof MomTemplateServiceError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.patch(
    "/admin/organizations/:organizationId/mom-templates/:templateId",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      const parsed = updateMomTemplateSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({
          error: "validation_error",
          message: zodErrorMessage(parsed.error),
        });
        return;
      }

      try {
        const actor = requireAuthUser(req);
        const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
        const templateId = requireRouteParam(req.params.templateId, "templateId");
        const template = await momTemplateService.updateTemplate(
          actor.id,
          organizationId,
          templateId,
          parsed.data,
        );
        res.json({ template: serializeMomTemplate(template) });
      } catch (err) {
        if (err instanceof MomTemplateServiceError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.post(
    "/admin/organizations/:organizationId/mom-templates/:templateId/duplicate",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      try {
        const actor = requireAuthUser(req);
        const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
        const templateId = requireRouteParam(req.params.templateId, "templateId");
        const template = await momTemplateService.duplicateTemplate(
          actor.id,
          organizationId,
          templateId,
        );
        res.status(201).json({ template: serializeMomTemplate(template) });
      } catch (err) {
        if (err instanceof MomTemplateServiceError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.post(
    "/admin/organizations/:organizationId/mom-templates/:templateId/set-default",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      try {
        const actor = requireAuthUser(req);
        const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
        const templateId = requireRouteParam(req.params.templateId, "templateId");
        const template = await momTemplateService.setDefaultTemplate(
          actor.id,
          organizationId,
          templateId,
        );
        res.json({ template: serializeMomTemplate(template) });
      } catch (err) {
        if (err instanceof MomTemplateServiceError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.post(
    "/admin/organizations/:organizationId/mom-templates/:templateId/archive",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      try {
        const actor = requireAuthUser(req);
        const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
        const templateId = requireRouteParam(req.params.templateId, "templateId");
        const template = await momTemplateService.archiveTemplate(
          actor.id,
          organizationId,
          templateId,
        );
        res.json({ template: serializeMomTemplate(template) });
      } catch (err) {
        if (err instanceof MomTemplateServiceError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.delete(
    "/admin/organizations/:organizationId/mom-templates/:templateId",
    authorize([UserRole.SUPER_ADMIN]),
    asyncHandler(async (req, res) => {
      try {
        const actor = requireAuthUser(req);
        const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
        const templateId = requireRouteParam(req.params.templateId, "templateId");
        await momTemplateService.deleteTemplate(actor.id, organizationId, templateId);
        res.json({ ok: true });
      } catch (err) {
        if (err instanceof MomTemplateServiceError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  router.post(
    "/admin/organizations/:organizationId/mom-templates/:templateId/upload",
    authorize([UserRole.SUPER_ADMIN]),
    (req, res, next) => {
      momTemplateUpload(req, res, (err) => {
        if (err) {
          res.status(400).json({ error: "upload_error", message: err.message });
          return;
        }
        next();
      });
    },
    asyncHandler(async (req, res) => {
      const file = req.file;
      if (!file) {
        res.status(400).json({ error: "file_required", message: "Template file is required" });
        return;
      }

      try {
        const actor = requireAuthUser(req);
        const organizationId = requireRouteParam(req.params.organizationId, "organizationId");
        const templateId = requireRouteParam(req.params.templateId, "templateId");
        const template = await momTemplateService.uploadTemplateFile(
          actor.id,
          organizationId,
          templateId,
          file.buffer,
          file.originalname,
          file.mimetype,
        );
        res.json({ template: serializeMomTemplate(template) });
      } catch (err) {
        if (err instanceof MomTemplateServiceError) {
          res.status(err.statusCode).json({ error: err.code, message: err.message });
          return;
        }
        throw err;
      }
    }),
  );

  return router;
}
