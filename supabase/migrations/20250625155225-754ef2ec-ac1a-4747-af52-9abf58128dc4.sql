
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  institution TEXT,
  research_credentials TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  PRIMARY KEY (id)
);

-- Create collections/bookmarks table
CREATE TABLE public.user_collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  artifact_id INTEGER NOT NULL,
  artifact_title TEXT NOT NULL,
  artifact_accession_number TEXT,
  collection_name TEXT DEFAULT 'My Bookmarks',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create persistent shopping carts table
CREATE TABLE public.user_carts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  artifact_id INTEGER NOT NULL,
  artifact_title TEXT NOT NULL,
  artifact_accession_number TEXT NOT NULL,
  rental_start_date DATE,
  rental_end_date DATE,
  rental_duration TEXT NOT NULL DEFAULT 'weekly',
  special_requirements TEXT,
  estimated_cost INTEGER NOT NULL DEFAULT 450,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment methods table
CREATE TABLE public.user_payment_methods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payment_type TEXT NOT NULL DEFAULT 'card',
  last_four TEXT,
  brand TEXT,
  is_default BOOLEAN DEFAULT false,
  stripe_payment_method_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create research rental history table
CREATE TABLE public.rental_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  artifacts JSONB NOT NULL,
  total_cost INTEGER NOT NULL,
  rental_period JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  researcher_info JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for collections
CREATE POLICY "Users can view their own collections" ON public.user_collections
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own collections" ON public.user_collections
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collections" ON public.user_collections
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collections" ON public.user_collections
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for carts
CREATE POLICY "Users can view their own cart" ON public.user_carts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cart items" ON public.user_carts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart items" ON public.user_carts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cart items" ON public.user_carts
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for payment methods
CREATE POLICY "Users can view their own payment methods" ON public.user_payment_methods
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own payment methods" ON public.user_payment_methods
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own payment methods" ON public.user_payment_methods
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own payment methods" ON public.user_payment_methods
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for rental history
CREATE POLICY "Users can view their own rental history" ON public.rental_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rental history" ON public.rental_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_user_collections_user_id ON public.user_collections(user_id);
CREATE INDEX idx_user_collections_artifact_id ON public.user_collections(artifact_id);
CREATE INDEX idx_user_carts_user_id ON public.user_carts(user_id);
CREATE INDEX idx_user_payment_methods_user_id ON public.user_payment_methods(user_id);
CREATE INDEX idx_rental_history_user_id ON public.rental_history(user_id);
