INSERT INTO "user" ("id", "firstName", "lastName", "email", "password", "tokenVersion") VALUES
(1, 'Ana', 'López', 'ana@example.com', '$2b$10$vCVC0l2s94o4SO1cesk8W.zBoIhi.3SBu2uhny0txmRSC3GH9.PAy', 1),
(2, 'Luis', 'Pérez', 'luis@example.com', '$2b$10$vCVC0l2s94o4SO1cesk8W.zBoIhi.3SBu2uhny0txmRSC3GH9.PAy', 1),
(3, 'Carla', 'Gómez', 'carla@example.com', '$2b$10$vCVC0l2s94o4SO1cesk8W.zBoIhi.3SBu2uhny0txmRSC3GH9.PAy', 1),
(4, 'David', 'Martínez', 'david@example.com', '$2b$10$vCVC0l2s94o4SO1cesk8W.zBoIhi.3SBu2uhny0txmRSC3GH9.PAy', 1),
(5, 'Elena', 'Ruiz', 'elena@example.com', '$2b$10$vCVC0l2s94o4SO1cesk8W.zBoIhi.3SBu2uhny0txmRSC3GH9.PAy', 1);

INSERT INTO category (id, name, description, color, user_id) VALUES
(1, 'Trabajo', 'Tareas laborales', '#FF5733', 1),
(2, 'Estudio', 'Actividades académicas', '#33C1FF', 2),
(3, 'Personal', 'Tareas personales', '#75FF33', 3),
(4, 'Deportes', 'Entrenamientos y rutinas', '#FFC300', 4),
(5, 'Salud', 'Citas médicas y más', '#DAF7A6', 5),
(6, 'Viajes', 'Preparación de viajes', '#8E44AD', 1),
(7, 'Finanzas', 'Control financiero', '#16A085', 2),
(8, 'Hogar', 'Tareas del hogar', '#F39C12', 3),
(9, 'Proyectos', 'Proyectos personales', '#D35400', 4),
(10, 'Social', 'Eventos sociales', '#3498DB', 5);

INSERT INTO tag (id, name, description, color, user_id) VALUES
(1, 'Urgente', 'Alta prioridad', '#FF0000', 1),
(2, 'Importante', 'Tareas importantes', '#FFA500', 2),
(3, 'Ocio', 'Actividades recreativas', '#00FF00', 3),
(4, 'Estudio', 'Relacionado con estudios', '#0000FF', 4),
(5, 'Trabajo', 'Tareas de trabajo', '#800080', 5),
(6, 'Revisión', 'Pendiente de revisar', '#FFFF00', 1),
(7, 'Compra', 'Relacionado con compras', '#00FFFF', 2),
(8, 'Casa', 'Del hogar', '#808080', 3),
(9, 'Reunión', 'Reuniones o encuentros', '#A52A2A', 4),
(10, 'Salud', 'Cuidado personal', '#FFC0CB', 5);

INSERT INTO task (id, name, description, category_id, user_id, state, "expiryDate", priority, duration) VALUES
(1, 'Preparar informe mensual', '<p>El <strong>informe</strong> debe incluir:</p><ul><li>Ventas</li><li>Gastos</li><li>Proyecciones</li></ul>', 1, 1, 'todo', '2025-09-01', 'high', 90),
(2, 'Estudiar para examen', '<p>Revisar capítulos <em>5 al 8</em> del libro de historia.</p><p><a href="https://ejemplo.com/temario">Temario oficial</a></p>', 2, 2, 'in_progress', '2025-09-02', 'high', 120),
(3, 'Llamar al médico', '<p>Agendar cita con <strong>Dr. Ramírez</strong> para revisión anual.</p>', 5, 5, 'todo', '2025-09-03', 'medium', 15),
(4, 'Limpiar garaje', '<p><strong>Tareas:</strong></p><ol><li>Organizar cajas</li><li>Barrer</li><li>Tirar basura</li></ol>', 8, 3, 'todo', '2025-09-04', 'low', 60),
(5, 'Actualizar currículum', '<p>Revisar <em>experiencia laboral</em> y actualizar perfil en <a href="https://linkedin.com">LinkedIn</a>.</p>', 3, 4, 'completed', '2025-09-05', 'medium', 45),
(6, 'Hacer compras', '<ul><li>Leche</li><li>Pan</li><li>Verduras</li><li>Papel higiénico</li></ul>', 8, 2, 'todo', '2025-09-06', 'high', 30),
(7, 'Entrenamiento', '<p>Rutina: <strong>pierna y abdomen</strong>.</p>', 4, 1, 'todo', '2025-09-07', 'medium', 60),
(8, 'Organizar viaje', '<p>Reservar hotel y vuelos para <em>Madrid</em>.</p>', 6, 1, 'todo', '2025-09-08', 'high', 120),
(9, 'Enviar presupuesto al cliente', '<p>Incluir:</p><ul><li>Costos detallados</li><li>Plazos</li><li>Condiciones</li></ul>', 1, 2, 'todo', '2025-09-09', 'high', 40),
(10, 'Visitar a los abuelos', '<p>Llevar regalos y pasar la tarde.</p>', 10, 3, 'archived', '2025-09-10', 'low', 180);

INSERT INTO tasks_tags (task_id, tag_id) VALUES
(1, 1), (1, 2),
(2, 4),
(3, 10),
(4, 8),
(5, 5),
(6, 7),
(7, 3),
(8, 6), (8, 1),
(9, 2), (9, 5),
(10, 9);

INSERT INTO task (id, name, description, category_id, user_id, state, expiryDate, priority, duration) VALUES
(11, 'Revisar código del proyecto', '<p>Revisar <strong>pull requests</strong> pendientes en GitHub.</p>', 1, 1, 'in_progress', '2025-09-11', 'high', 60),
(12, 'Estudiar matemáticas', '<p>Resolver ejercicios de <em>álgebra lineal</em> y <em>cálculo diferencial</em>.</p>', 2, 2, 'todo', '2025-09-12', 'medium', 90),
(13, 'Pagar servicios', '<ul><li>Agua</li><li>Luz</li><li>Internet</li></ul>', 7, 3, 'todo', '2025-09-13', 'medium', 30),
(14, 'Actualizar sitio web', '<p>Subir nueva versión con <strong>mejoras en diseño</strong> y <em>optimización SEO</em>.</p>', 9, 4, 'in_progress', '2025-09-14', 'high', 120),
(15, 'Cita con nutricionista', '<p>Consultar <strong>dieta actual</strong> y ajustes necesarios.</p>', 5, 5, 'todo', '2025-09-15', 'low', 45),
(16, 'Hacer backups', '<p>Respaldar archivos importantes a <em>nube</em> y disco externo.</p>', 9, 1, 'completed', '2025-09-16', 'medium', 40),
(17, 'Limpiar cocina', '<ul><li>Lavar platos</li><li>Desinfectar superficies</li><li>Organizar despensa</li></ul>', 8, 2, 'todo', '2025-09-17', 'low', 30),
(18, 'Enviar CV a empresas', '<p>Aplicar a ofertas en <a href="https://linkedin.com">LinkedIn</a> y <a href="https://indeed.com">Indeed</a>.</p>', 3, 3, 'in_progress', '2025-09-18', 'high', 90),
(19, 'Planificar fiesta de cumpleaños', '<p>Reservar salón y contactar proveedores.</p>', 10, 4, 'todo', '2025-09-19', 'medium', 180),
(20, 'Revisar estado financiero', '<p>Actualizar hoja de <strong>ingresos y gastos</strong>.</p>', 7, 5, 'todo', '2025-09-20', 'medium', 45),

(21, 'Leer libro pendiente', '<p>Continuar lectura de <em>"Sapiens"</em>.</p>', 3, 1, 'archived', '2025-09-21', 'low', 60),
(22, 'Hacer ejercicio', '<p>Cardio de 30 minutos y <strong>rutina de fuerza</strong>.</p>', 4, 2, 'todo', '2025-09-22', 'medium', 45),
(23, 'Visitar dentista', '<p>Control anual con <strong>limpieza dental</strong>.</p>', 5, 3, 'todo', '2025-09-23', 'low', 30),
(24, 'Estudiar inglés', '<p>Revisar <em>phrasal verbs</em> y practicar listening.</p>', 2, 4, 'in_progress', '2025-09-24', 'medium', 90),
(25, 'Escribir post del blog', '<p>Publicar entrada sobre <strong>productividad</strong>.</p>', 9, 5, 'completed', '2025-09-25', 'medium', 60),
(26, 'Cocinar algo nuevo', '<p>Probar receta de <em>curry tailandés</em>.</p>', 8, 1, 'todo', '2025-09-26', 'low', 90),
(27, 'Jornada de voluntariado', '<p>Participar en limpieza de playa con <a href="https://voluntarios.org">Voluntarios.org</a></p>', 10, 2, 'todo', '2025-09-27', 'medium', 180),
(28, 'Actualizar software', '<p>Instalar actualizaciones de seguridad en todos los dispositivos.</p>', 6, 3, 'in_progress', '2025-09-28', 'high', 30),
(29, 'Organizar escritorio', '<ul><li>Archivar documentos</li><li>Limpiar cables</li><li>Ordenar cajones</li></ul>', 8, 4, 'todo', '2025-09-29', 'low', 30),
(30, 'Cita con terapeuta', '<p>Sesión mensual de <strong>psicoterapia</strong>.</p>', 5, 5, 'todo', '2025-09-30', 'medium', 50);

INSERT INTO tasks_tags (task_id, tag_id) VALUES
(11, 1), (11, 6),
(12, 4),
(13, 7),
(14, 5),
(15, 10),
(16, 2),
(17, 8),
(18, 1), (18, 3),
(19, 9),
(20, 2),

(21, 3),
(22, 4),
(23, 10),
(24, 4),
(25, 5), (25, 6),
(26, 7),
(27, 9),
(28, 6),
(29, 8),
(30, 10);
