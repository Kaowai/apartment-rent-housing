import { Injectable } from '@angular/core';
import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { defer, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  supabaseUrl = 'https://cdskqktuaydhugkyuhjd.supabase.co';
  supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkc2txa3R1YXlkaHVna3l1aGpkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE1NzgwMTEsImV4cCI6MjA0NzE1NDAxMX0.lGS9l8T4_6rYsdsfFce1rI9PsYGt6bAS4gtFzRYVYio';
  supabaseService_Role =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkc2txa3R1YXlkaHVna3l1aGpkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTU3ODAxMSwiZXhwIjoyMDQ3MTU0MDExfQ.wF9D-VDFVljNh2Yn48yMK0BGclcWZ3bB156pTvIBC2U';
  public supabaseClient: SupabaseClient;

  constructor() {
    this.supabaseClient = createClient(this.supabaseUrl, this.supabaseKey);
  }

  upload(
    bucket: string,
    path: string,
    file: File
  ): Observable<{ data: any; error: any }> {
    return defer(() =>
      this.supabaseClient.storage.from(bucket).upload(path, file)
    );
  }

  update(
    bucket: string,
    id: string,
    file: File
  ): Observable<{ data: any; error: any }> {
    return defer(() =>
      this.supabaseClient.storage.from(bucket).update(id, file)
    );
  }

  download(
    bucket: string,
    path: string
  ): Observable<{ data: any; error: any }> {
    return defer(() => this.supabaseClient.storage.from(bucket).download(path));
  }

  remove(bucket: string, path: string): Observable<{ data: any; error: any }> {
    return defer(() => this.supabaseClient.storage.from(bucket).remove([path]));
  }

  createBucket(bucket: string): Observable<{ data: any; error: any }> {
    return defer(() => this.supabaseClient.storage.createBucket(bucket));
  }

  getBucket(bucket: string): Observable<{ data: any; error: any }> {
    return defer(() => this.supabaseClient.storage.getBucket(bucket));
  }
}
