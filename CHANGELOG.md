# ChambeApp Documentation CHANGELOG

All notable changes to documentation will be documented in this file.

## [1.3.0] - 2026-09-01

### Changed
- Monetizacion.md: Eliminado plan Empresa ($75k) - solo Básico ($15k) y Profesional ($35k)
- Monetizacion.md: Eliminado sistema escrow - pagos directos sin retención
- Monetizacion.md: Actualizadas proyecciones financieras
- Terminos_y_Condiciones.md: Eliminado plan Empresa de planes de suscripción
- Flujo_Aplicacion.md: Eliminada referencia a escrow automático
- ANALISIS_MONETIZACION.md: Actualizado para reflejar cambios (38.5% implementado)

## [1.2.0] - 2026-09-01

### Added
- Flujo de Aplicacion.md: Documento completo del flujo de la aplicación
- RF-22: Sistema de Desbloqueo de Información (nuevo)
- RF-23: Confirmación Dual de Finalización (nuevo)
- RF-24: Gestión de Ofertas (nuevo)
- HU-19: Desbloqueo de Información (nueva)
- HU-20: Confirmación Dual (nueva)
- HU-21: Gestión de Ofertas (nueva)
- Actualización de matriz de trazabilidad (HU-19 a HU-21)

### Changed
- Requerimientos.md: Agregados RF-22, RF-23, RF-24
- HistoriasDeUsuario.md: Agregadas HU-19, HU-20, HU-21
- Monetizacion.md: Eliminado plan Empresa ($75k) - solo Básico ($15k) y Profesional ($35k)
- Monetizacion.md: Eliminado sistema escrow - pagos directos sin retención
- Requerimientos.md: Eliminadas referencias a plan Empresa y escrow
- HistoriasDeUsuario.md: Eliminadas referencias a plan Empresa y escrow
- Flujo_Aplicacion.md: Eliminada referencia a escrow automático
- Terminos_y_Condiciones.md: Eliminado plan Empresa de planes de suscripción
- Arquitectura_Software.md: Eliminadas referencias a escrow
- Diagramas PlantUML: Actualizados para eliminar escrow
- seed/test_dev.md: Eliminada referencia a escrow

### Fixed
- Completamiento de gaps críticos en flujo de aplicación

## [1.1.0] - 2026-09-01

### Added
- RF-18/19/20/21 user stories documented
- RNF-AUD (Roles: admin/superadmin/verificador/soporte) NFRs
- User role renaming: trabajador ↔ pdS, empleador ↔ solicitante
- Credenciales de usuarios demo y guía test_dev local
- Architecture diagrams (5 PlantUML diagrams)
- Branding manual and design tokens (CSS custom properties)
- Monetization model: virtual coins (1 moneda = $100 COP), commissions
- Legal terms: Colombian labor law, Habeas Data documentation
- Full requirements in EARS format (RF-01 to RF-17 + 7 NFRs)
- User stories (HU-01 to HU-18) with acceptance criteria

### Changed
- Renamed archived doc/ copies to Chambeapp_Doc canonical location
- Updated architecture documentation with PlantUML sources
- Improved requirements traceability matrix

### Fixed
- Documentation consistency fixes
- Role naming alignment across all docs

## [1.0.0] - 2026-08-18

### Added
- Initial documentation setup
- Architecture overview and folder structure
- Branding assets and logo
- Requirements base doc and monetization terms
- Legal terms and conditions (Colombian labor law)