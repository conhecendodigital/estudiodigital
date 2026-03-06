-- Criação do Bucket de Storage para Avatares (se não existir)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Definir políticas públicas para os avatares (todos podem ver)
CREATE POLICY "Public Access for avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Para permitir que apenas o próprio usuário consiga subir/editar seu avatar
CREATE POLICY "Users can upload their own avatars" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (string_to_array(name, '/'))[1]);

CREATE POLICY "Users can update their own avatars" ON storage.objects
FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (string_to_array(name, '/'))[1]);

CREATE POLICY "Users can delete their own avatars" ON storage.objects
FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (string_to_array(name, '/'))[1]);
